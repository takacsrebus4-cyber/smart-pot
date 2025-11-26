const host = 'http://127.0.0.1:3000'

document.getElementById("loginForm").addEventListener("submit", (e) => {
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
                //console.log(response.accessToken)
                localStorage.setItem("username", username);
                window.location.href = "./dashboard.html";
            }
        }
    });
});