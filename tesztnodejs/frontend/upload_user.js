document.getElementById("button").addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    fetch('http://localhost:3000/upload/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.valid == true) {
            alert("User uploaded successfully, redirecting to login page.");
            window.location.href = "./login.html";
        }
    });
});