plant_ids = [];

// Cancel button event listener, redirects to my_plants.html
document.getElementById("cancel").addEventListener("click", function (evt) {
    evt.preventDefault();
    window.location.href = "./my_plants.html";
});


// Losad plants into the select dropdown
document.getElementById("loadbtn").addEventListener("click", async (e) => {
    e.preventDefault();

    // Query the backend for the current plants of the user
    fetch('http://localhost:3000/current_plant_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
            userid: localStorage.getItem("userid")
        }),
    }).then(res => res.json()).then(response => {
        console.log(response);

        // Handle token expiration
        if (response.tokenValid == false) {
            alert("Jelentkezzen be.");
            localStorage.clear();
            window.location.href = "./login.html";
        }
        // Populate the select dropdown with the retrieved plants
        else if (response.length > 0) {
            const plantSelect = document.getElementById("plantSelect");
            plantSelect.innerHTML = ""; // Clear existing options
            response.forEach(plant => {
                const option = document.createElement("option");
                option.value = plant.id;
                option.text = plant.id + " - " + plant.plant_name;
                plantSelect.appendChild(option);
            });
        } else {
            alert("No plants found.");
        }
    });
});


// Delete plant event listener
document.getElementById("delete").addEventListener("click", async (e) => {
    e.preventDefault();
    
    // Get the selected plant ID
    plant_ids.push(document.getElementById("plantSelect").value);

    // Send DELETE request to remove plant data
    fetch('http://localhost:3000/delete/data', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
            plant_ids: plant_ids,
        }),
    }).then(res => res.json()).then(response => {
        console.log(response);

        // Handle token expiration
        if (response.tokenValid == false) {
            alert("Jelentkezzen be.");
            localStorage.clear();
            window.location.href = "./login.html";
        }
        // If data deletion was successful or there was no data belonging to the chosen plant, proceed to delete from current_plant
        else if (response.success == true || response.dataFound == false) {
            fetch('http://localhost:3000/delete/current_plant', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: JSON.stringify({
                    plant_ids: plant_ids,
                }),
            }).then(res => res.json()).then(response => {
                console.log(response);

                // Handle token expiration
                if (response.tokenValid == false) {
                    alert("Jelentkezzen be.");
                    localStorage.clear();
                    window.location.href = "./login.html";
                }
                else if (response.success == true) {
                    alert("Növény sikeresen törölve.");
                }
                else {
                    alert("Probléma a növény törlésekor.");
                }
            });
        }
        else
        {
            alert("Probléma az adat törlésekor.")
        }
    });
});
