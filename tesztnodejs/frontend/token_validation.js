let refreshToken = "";
let username = localStorage.getItem("username") || null;
console.log(`Username from localStorage: ${username}`);
const host = 'http://127.0.0.1:3000'
const authHost = 'http://127.0.0.1:5000'


document.body.onload = function () {
    document.getElementById("dashboard").click();
}

//token validation on dashboard click
document.getElementById("dashboard").addEventListener("click", function (evt) {
    fetch(host + '/getUserinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
    }).then(res => res.json()).then(response => {
        if (response.found === false) {
            window.location.href = "./login.html";
        }
        refreshToken = response.refreshToken;
        const validateTokenBody = {
            accessToken: response.accessToken,
            refreshToken: refreshToken
        };
        fetch(authHost + '/validateToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validateTokenBody),
        }).then(res => res.json()).then(response => {
            if (response.tokenValid == false || response.tokenValid == undefined) {
                if (response.refreshTokenValid == false) {
                    window.location.href = "./login.html";
                }
                else {
                    const refreshTokenBody = {
                        username: username,
                        refreshToken: refreshToken
                    };
                    //generate a new access token using the refresh token
                    fetch(host + '/refreshToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(refreshTokenBody),
                    }).then(res => res.json()).then(response => {
                    });
                }
            }
        });
    });
});