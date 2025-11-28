document.getElementById("logout").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.getElementById('logout_modal').style.display = 'block';
});

document.getElementById("no_btn").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.getElementById('logout_modal').style.display = 'none';
});


document.getElementById("logout_btn").addEventListener("click", function (evt) {
    if (username === undefined || username === null) {
        alert("You are not logged in, redirecting to login page...");
        window.location.href = "./login.html";
    }
    const logoutBody = {
        username: username,
        refreshToken: refreshToken
    };
    fetch(host + '/logout', {
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