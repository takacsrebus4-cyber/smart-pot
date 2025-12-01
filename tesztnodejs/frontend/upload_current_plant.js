const { use } = require("react");

document.getElementById("cancel").addEventListener("click", function (evt) {
    evt.preventDefault();
    window.location.href = "./my_plants.html";
});


document.getElementById("upload").addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
        plant_name: document.getElementById("plant_name").value,
        userid: localStorage.getItem("userid")
    };
    fetch('http://localhost:3000/upload/current_plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.success == true) {
            alert("Current plant uploaded successfully!");
        }
        else {
            alert("Error uploading current plant.");
        }
    });
});