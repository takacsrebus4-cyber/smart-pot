document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    username = document.getElementById("username").value
    fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        if (response.accessToken === undefined) {
            alert("Helytelen bejelentkezési adatok!")
        }
        else {
            console.log(response.accessToken)
            //localStorage.clear();
            //localStorage.setItem("accessToken", JSON.stringify(response.accessToken));
            //localStorage.setItem("refreshToken", JSON.stringify(response.refreshToken));
            window.location.href = "./test.html";
        }
    });
});