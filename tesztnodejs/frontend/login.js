const host = 'http://127.0.0.1:3000'


document.getElementById("button").addEventListener("click", (e) => {
    e.preventDefault();
    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    username = document.getElementById("username").value
    fetch(host + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        if (response.userNotFound === true) {
            document.getElementById("usernameError").style.display = 'block';
        }
        else {
            if (response.accessToken === undefined) {
                document.getElementById("passwordError").style.display = 'block';
            }
            else {
                localStorage.setItem("username", username);
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                localStorage.setItem("userid", response.userid);

                window.location.href = "./dashboard.html";
            }
        }
    });
});