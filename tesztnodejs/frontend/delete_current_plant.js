document.getElementById("cancel").addEventListener("click", function (evt) {
    evt.preventDefault();
    window.location.href = "./my_plants.html";
});


document.getElementById("loadbtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
        userid: localStorage.getItem("userid")
    };
    fetch('http://localhost:3000/current_plant_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        // Log the response to verify its structure
        console.log(response);
        if (response != undefined) {
            const plantSelect = document.getElementById("plantSelect");
            plantSelect.innerHTML = ""; // Clear existing options
            response.forEach(plant => {
                const option = document.createElement("option");
                option.value = plant.id;
                option.text = plant.id + " " + plant.plant_name;
                plantSelect.appendChild(option);
            });
        } else {
            alert("No plants found.");
        }
    });
});

document.getElementById("delete").addEventListener("click", async (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/delete/current_plant', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userid: localStorage.getItem("userid"),
            plant_id: document.getElementById("plantSelect").value
        }),
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.success == true) {
            alert("Plant deleted successfully.");
        }
        else {
            alert("Failed to delete plant.");
        }
    });
});
