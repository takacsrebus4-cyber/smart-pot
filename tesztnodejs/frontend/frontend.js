let refreshToken = "";
let username = localStorage.getItem("username") || "szar";
console.log(`Username from localStorage: ${username}`);


document.body.onload = function () {
    document.getElementById("dashboard").click();
}

//token validation on dashboard click
document.getElementById("dashboard").addEventListener("click", function (evt) {
    fetch('http://127.0.0.1:3000/getUserinfo', {
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
        //console.log(`Refresh token received: ${response.refreshToken}`);
        //console.log(`Access token received: ${response.accessToken}`);
        const validateTokenBody = {
            accessToken: response.accessToken,
            refreshToken: refreshToken
        };
        fetch('http://127.0.0.1:5000/validateToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validateTokenBody),
        }).then(res => res.json()).then(response => {
            //console.log("Token validation response:");
            //console.log(response);
            if (response.tokenValid == false || response.tokenValid == undefined) {
                if (response.refreshTokenValid == false) {
                    window.location.href = "./login.html";
                    //alert("Both tokens are invalid, redirecting to login page...");
                }
                else {
                    //alert("Access token expired, but refresh token is valid. Generating new access token...");
                    const refreshTokenBody = {
                        username: username,
                        refreshToken: refreshToken
                    };
                    //Here we should generate a new access token using the refresh token
                    fetch('http://localhost:3000/refreshToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(refreshTokenBody),
                    }).then(res => res.json()).then(response => {
                        //console.log("New access token generated:");
                        //console.log(response.accessToken);
                        //console.log("New refresh token generated:");
                        //console.log(response.refreshToken);
                    });
                }
            }
            else {
                //alert("Access token is valid.");
            }
        });
    });
});


document.getElementById("logout").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.getElementById('logout_modal').style.display = 'block';
});

document.getElementById("no_btn").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.getElementById('logout_modal').style.display = 'none';
});


//logout
document.getElementById("logout_btn").addEventListener("click", function (evt) {
    fetch('http://127.0.0.1:3000/getUsername', {
        method: 'GET',
        headers: {
            'Connention': 'keep-alive',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'Microsoft Edge/141.0.3537.99, Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/'
        }
    }).then(res => res.json()).then(response => {
        username = response.username;
        if (username === undefined || username === null) {
            alert("You are not logged in, redirecting to login page...");
            window.location.href = "./login.html";
        }
        const logoutBody = {
            username: username,
            refreshToken: refreshToken
        };
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logoutBody),
        }).then(res => res.json()).then(response => {
            if (response.logout === false) {
                alert("Logout failed, please try again.");
            }
            else {
                username = "";
                refreshToken = "";
                localStorage.clear();

                //alert("Logged out successfully, redirecting to login page...");
                window.location.href = "./login.html";
            }
        });
    });
});