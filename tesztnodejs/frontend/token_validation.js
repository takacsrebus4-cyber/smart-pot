const host = 'http://127.0.0.1:3000'
const authHost = 'http://127.0.0.1:5000'


document.body.onload = function () {
    document.getElementById("dashboard").click();
}

//token validation on dashboard click
document.getElementById("dashboard").addEventListener("click", function () {
    if (localStorage.getItem("accessToken") === undefined || localStorage.getItem("accessToken") === null) {
        alert("Nincs hozzáférési engedélye");
        window.location.href = "./login.html";
    }
    fetch(authHost + '/validateToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("accessToken"),
            refreshToken: localStorage.getItem("refreshToken")
        }),
    }).then(res => res.json()).then(response => {
        if (response.tokenValid == false || response.tokenValid == undefined) {
            if (response.refreshTokenValid == false) {
                alert("Hozzáférés ideje lejárt.");
                window.location.href = "./login.html";
            }
            else {
                //generate a new access token using the refresh token
                fetch(host + '/refreshToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("username"),
                        refreshToken: localStorage.getItem("refreshToken")
                    }),
                }).then(res => res.json()).then(response => {
                    localStorage.setItem("accessToken", response.accessToken);
                    localStorage.setItem("refreshToken", response.refreshToken);
                });
            }
        }
    });
});