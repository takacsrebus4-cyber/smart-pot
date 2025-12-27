document.getElementById("load-current-plants-btn").addEventListener("click", function () {
    console.log("Load Current Plants button clicked.");
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
        var current_plants = response;
        console.log("Current plants response:", current_plants);
        if (response && response.length > 0) {

            var plantsGrid = document.querySelector('.plants-grid');
            plantsGrid.innerHTML = ''; // Clear existing plants
            current_plants.forEach(plant => {
                getLatestData(plant, plantsGrid);
            });
        }
        else {
            // Handle case when no plants are found
            const plantsGrid = document.querySelector('.plants-grid');
            plantsGrid.innerHTML = '<p>Nem található növény.</p>';
        }
    });
});



function getLatestData(plant, plantsGrid) {

    fetch('http://localhost:3000/query/latest_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            plant_id: plant.id,
        })
    }).then(res => res.json()).then(response => {
        console.log(response);
        var plantCard = document.createElement('div');
        plantCard.className = 'plant-card';
        if (response && response.length > 0) {
            var date = new Date(response[0].timestamp);
            plantCard.innerHTML = `<div class="plant-header">
                            <h3 class="plant-name">` + plant.id + ` - ` + plant.plant_name + `</h3>
                            <span class="plant-status status-caution">Kevés fény</span>
                        </div>
                        <div class="plant-metrics">
                            <div class="metric">
                                <div class="metric-value">` + response[0].temperature + `°C</div>
                                <div class="metric-label">Hőmérséklet</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">` + response[0].humidity + `%</div>
                                <div class="metric-label">Páratartalom</div>
                            </div>
                        </div>
                        <div class="mb-1">
                            <div class="metric-label">Talajnedvesség</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ` + (response[0].soil_moisture/1023*100) + `%"></div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="metric-label">Fény intenzitása</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ` + ((response[0].light_intensity/20000)*100) + `%"></div>
                            </div>
                        </div>
                        <div class="metric-timestamp">Utolsó frissítés: ` + date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + `</div>`;
            plantsGrid.appendChild(plantCard);
        } else {
            plantCard.innerHTML = `<div class = "plant-header">
                            <h3 class="plant-name">` + plant.id + ` - ` + plant.plant_name + `</h3>
                            <span class="plant-status status-unknown">Nincs adat</span>
                        </div>`;
            plantsGrid.appendChild(plantCard);
        }
    });
}