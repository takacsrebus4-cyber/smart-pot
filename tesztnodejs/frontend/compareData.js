function compareData(plant_name, light_intensity, soil_moisture, temperature, humidity) {
    fetch('http://localhost:3000/query/plant_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            plant_name: plant_name,
        })
    }).then(res => res.json()).then(response => {
        if (response.tokenValid === false) {
            alert("Session expired. Please log in again.");
            window.location.href = "./login.html";
        }
        else if (response && response.length > 0) {
            var plant = response[0];
            var alerts = [];


            if (light_intensity < plant.min_light_intensity || light_intensity > plant.max_light_intensity) {
                alerts.push("Light Intensity out of range!");
            }

            if (soil_moisture < plant.min_soil_moisture || soil_moisture > plant.max_soil_moisture) {
                alerts.push("Soil Moisture out of range!");
            }

            if (temperature < plant.min_temperature || temperature > plant.max_temperature) {
                alerts.push("Temperature out of range!");
            }

            if (humidity < plant.min_humidity || humidity > plant.max_humidity) {
                alerts.push("Humidity out of range!");
            }



        }

    });
}