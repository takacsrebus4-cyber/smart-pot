document.getElementById("load-current-plants-btn").addEventListener("click", function () {
    // Query the backend for the current plants of the user
    fetch('http://localhost:3000/current_plant_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            userid: localStorage.getItem('userid')
        })
    }).then(res => res.json()).then(response => {
        console.log(response);
        var current_plants = response.current_plants;
        var mac_address_to_plant_id = response.mac_address_to_plant_id;

        if (current_plants && current_plants.length > 0) {

            var plantsGrid = document.querySelector('.plants-grid');
            plantsGrid.innerHTML = ''; // Clear existing plants
            current_plants.forEach(plant => {
                var mac_address = "Nincs hozzárendelve arduino";
                mac_address_to_plant_id.forEach(item => {
                    if (item.plant_id === plant.id) {
                        mac_address = item.mac_address;
                    }
                });
                getLatestData(plant, mac_address, plantsGrid);
            });
        }
        else {
            // Handle case when no plants are found
            const plantsGrid = document.querySelector('.plants-grid');
            plantsGrid.innerHTML = '<p>Nem található növény.</p>';
        }
    });
});



function getLatestData(current_plant, mac_address, plantsGrid) {

    fetch('http://localhost:3000/query/latest_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            plant_id: current_plant.id,
        })
    }).then(res => res.json()).then(latest_data_response => {
        console.log(latest_data_response);
        var plantCard = document.createElement('div');
        plantCard.className = 'plant-card';

        if (latest_data_response && latest_data_response.length > 0) {
            var currentData = latest_data_response[0];
            var alerts = [];

            //compare data with plant requirements
            fetch('http://localhost:3000/query/plant_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify({
                    plant_name: current_plant.plant_name,
                })
            }).then(res => res.json()).then(plant_data_response => {
                if (plant_data_response.tokenValid === false) {
                    alert("Jelentkezzen be újra.");
                    window.location.href = "./login.html";
                }

                if (plant_data_response && plant_data_response.length > 0) {
                    console.log("Plant data: ");
                    console.log(plant_data_response);
                    var plant = plant_data_response[0];

                    if (currentData.light_intensity < plant.min_light_intensity) {
                        alerts.push(`<span class="plant-status status-warning">Nem elég erős fény</span>`);
                    }

                    if (currentData.light_intensity > plant.max_light_intensity) {
                        alerts.push(`<span class="plant-status status-warning">Túl erős fény</span>`);
                    }

                    if (currentData.soil_moisture < plant.min_soil_moisture) {
                        alerts.push(`<span class="plant-status status-warning">Öntözés szükséges</span>`);
                    }

                    if (currentData.soil_moisture > plant.max_soil_moisture) {
                        alerts.push(`<span class="plant-status status-warning">Túlöntözve</span>`);
                    }

                    if (currentData.temperature < plant.min_temperature) {
                        alerts.push(`<span class="plant-status status-warning">Alacsony hőmérséklet</span>`);
                    }

                    if (currentData.temperature > plant.max_temperature) {
                        alerts.push(`<span class="plant-status status-warning">Magas hőmérséklet</span>`);
                    }

                    if (currentData.humidity < plant.min_humidity) {
                        alerts.push(`<span class="plant-status status-warning">Alacsony páratartalom</span>`);
                    }

                    if (currentData.humidity > plant.max_humidity) {
                        alerts.push(`<span class="plant-status status-warning">Magas páratartalom</span>`);
                    }

                    if (alerts.length === 0) {
                        alerts.push(`<span class="plant-status status-healthy">Minden rendben</span>`);
                    }


                }
                else {
                    alerts.push(`<span class="plant-status status-unknown">Nincs adat</span>`);
                }

                var date = new Date(currentData.timestamp);

                plantCard.innerHTML = `<div class="plant-header">
                            <h3 class="plant-name">` + current_plant.id + ` - ` + current_plant.plant_name + `</h3>` +
                    alerts.join('\n') + `
                        </div>
                        <div class="plant-metrics">
                            <div class="metric">
                                <div class="metric-value">` + currentData.temperature + `°C</div>
                                <div class="metric-label">Hőmérséklet</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">` + currentData.humidity + `%</div>
                                <div class="metric-label">Páratartalom</div>
                            </div>
                        </div>
                        <div class="mb-1">
                            <div class="metric-label">Talajnedvesség</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ` + (currentData.soil_moisture / 1023 * 100) + `%"></div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="metric-label">Fény intenzitása</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ` + ((currentData.light_intensity / 20000) * 100) + `%"></div>
                            </div>
                        </div>
                        <div class="assigned-arduino">Hozzárendelve: ` + mac_address + `
                        <div class="metric-timestamp">Utolsó frissítés: ` + date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + `</div>`;
                plantsGrid.appendChild(plantCard);

            });
        } else {
            plantCard.innerHTML = `<div class = "plant-header">
                            <h3 class="plant-name">` + current_plant.id + ` - ` + current_plant.plant_name + `</h3>
                            <span class="plant-status status-unknown">Nincs adat</span>
                            </div>
                            <div class="assigned-arduino">Hozzárendelve: ` + mac_address + `</div>`;
            plantsGrid.appendChild(plantCard);
        }
    });
}
