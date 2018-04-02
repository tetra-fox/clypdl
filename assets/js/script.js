const regex = new RegExp("http(s)?(:\/\/)(www.)?(clyp.it)\/(.*)", "i");
const api = "https://api.clyp.it/"
const proxy = "https://cors-anywhere.herokuapp.com/";  // sorry clyp

let mp3Url;
let oggUrl;

let id;

$("#dlForm").submit(function (e) {
    e.preventDefault();

    var url = $("#urlField").val();
    id = url.substring(url.lastIndexOf("/") + 1);

    if (!$("#error").hasClass("hidden") || !$(".dlButton").hasClass("hidden")) {
        $("#error").addClass("hidden");
        $(".dlButton").addClass("hidden");
    }

    if (regex.test($("#urlField").val())) {
        $.ajax({
            url: proxy + api + id,
            dataType: "json",
            success: (res) => {
                mp3Url = res.SecureMp3Url;
                oggUrl = res.SecureOggUrl;
                $(".dlButton").removeClass("hidden");
            },
            error: (xhr) => {
                showError(xhr.statusText);
            }
        });
    } else {
        showError("Inavlid URL");
    }
});

const showError = (msg) => {
    $("#error").removeClass("hidden");
    $("#errorText").text(msg);
}

$("#downloadMp3").click(() => {
    var req = new XMLHttpRequest();
    req.open("GET", proxy + mp3Url, true);
    req.responseType = "blob";
    req.onload = (e) => {
        download(req.response, `${id}.mp3`, "audio/mp3");
    }
    req.send();
});

$("#downloadOgg").click(() => {
    var req = new XMLHttpRequest();
    req.open("GET", proxy + oggUrl, true);
    req.responseType = "blob";
    req.onload = (e) => {
        download(req.response, `${id}.ogg`, "audio/ogg");
    }
    req.send();
});