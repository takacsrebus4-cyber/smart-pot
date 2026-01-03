document.getElementById("loadbtn").addEventListener("click", function (e) {
    e.preventDefault();
    fetch('http://localhost:3000/query/plant_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
    }).then(res => res.json()).then(plant_data_response => {
        console.log(plant_data_response);
        if (plant_data_response.tokenValid == false) {
            alert("Kérem jelentkezzen be.");
            window.location.href = "./login.html";
        }



        const plantSelect = document.getElementById("plantSelect");
        plantSelect.innerHTML = ""; // Clear existing options
        plant_data_response.forEach(plant => {
            const option = document.createElement("option");
            option.value = plant.name;
            option.text = plant.name;
            plantSelect.appendChild(option);
        });
    });



    fetch('http://localhost:3000/query/arduino_mac_addresses', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
    }).then(res => res.json()).then(arduinoResponse => {
        console.log("Arduino response: ");
        console.log(arduinoResponse);
        if (arduinoResponse.tokenValid === false) {
            alert("Jelentkezzen be újra.");
            window.location.href = "./login.html";
        }

        var arduinoSelect = document.getElementById("arduinoSelect");
        console.log(arduinoSelect);
        arduinoSelect.innerHTML = ''; // Clear existing options
        arduinoResponse.forEach(arduino => {
            if (arduino.plant_id == 0) {
                var option = document.createElement("option");
                option.value = arduino.mac_address;
                option.text = arduino.mac_address;
                arduinoSelect.appendChild(option);
            }
            else{
                var option = document.createElement("option");
                option.value = "0";
                option.text = "Nincs szabad Arduino";
                arduinoSelect.appendChild(option);
            }
        });
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
        userid: localStorage.getItem("userid"),
        mac_address: document.getElementById("arduinoSelect").value
    };
    fetch('http://localhost:3000/upload/current_plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        console.log("Upload current plant response: " + response);
        if (response.success == true) {
            alert("Növény sikeresen hozzáadva az adatbázishoz!");
        }
        else if (response.tokenValid == false) {
            alert("Kérem jelentkezzen be.");
            window.location.href = "./login.html";
        }
        else {
            alert("Probléma a feltöltéskor.");
        }
    });
});