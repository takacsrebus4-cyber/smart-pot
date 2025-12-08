document.getElementById("loadbtn").addEventListener("click", function (e) {
    e.preventDefault();
    fetch('http://localhost:3000/query/plant_data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.tokenValid == false) {
            alert("You are not authorized to perform this action. Please log in.");
            window.location.href = "./login.html";
        }
        else {
            const plantSelect = document.getElementById("plantSelect");
            plantSelect.innerHTML = ""; // Clear existing options
            response.forEach(plant => {
                const option = document.createElement("option");
                option.value = plant.name;
                option.text = plant.name;
                plantSelect.appendChild(option);
            });
        }
    });
});


document.getElementById("cancel").addEventListener("click", function (evt) {
    evt.preventDefault();
    window.location.href = "./my_plants.html";
});


document.getElementById("upload").addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(localStorage.getItem("userid"));
    const data = {
        plant_name: document.getElementById("plantSelect").value,
        userid: localStorage.getItem("userid")
    };
    fetch('http://localhost:3000/upload/current_plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.success == true) {
            alert("Current plant uploaded successfully!");
        }
        else if (response.tokenValid == false) {
            alert("You are not authorized to perform this action. Please log in.");
            window.location.href = "./login.html";
        }
        else {
            alert("Error uploading current plant.");
        }
    });
});