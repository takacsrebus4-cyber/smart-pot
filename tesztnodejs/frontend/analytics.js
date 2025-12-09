document.body.onload = function () {
    document.getElementById("load-current-plants-btn").click();
}

document.getElementById("load-current-plants-btn").addEventListener("click", function () {
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
            alert("You are not authorized to perform this action. Please log in.");
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
            displayAnalyticsSection();
        } else {
            alert("No plants found.");
        }
    });
});


document.getElementById("plantSelect").addEventListener("change", function (e) {
    e.preventDefault();
    displayAnalyticsSection();
});




function displayAnalyticsSection() {

    var plant_name = document.getElementById("plantSelect").value.split(" - ")[1]

    var dates = [];

    var soilMoistureLevels = [];
    var lightIntensityLevels = [];
    var temperatureLevels = [];
    var humidityLevels = [];

    var minTemperature = [0, 0, 0, 0, 0, 0, 0];
    var maxTemperature = 0;

    var minHumidity = [0, 0, 0, 0, 0, 0, 0];
    var maxHumidity = 0;

    var minSoilMoisture = [0, 0, 0, 0, 0, 0, 0];
    var maxSoilMoisture = 0;

    var minLightIntensity = [0, 0, 0, 0, 0, 0, 0];
    var maxLightIntensity = 0;

    fetch("http://127.0.0.1:3000/query/plant_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
            plant_name: plant_name
        }),
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.tokenValid == false) {
            alert("Session expired. Please log in again.");
            localStorage.clear();
            window.location.href = "./login.html";
        }

        var analyticsSection = document.getElementsByClassName("analytics-section");

        for (let i = 0; i < analyticsSection.length; i++) {
            analyticsSection[i].style.display = "block";
        }

        minSoilMoisture.fill(response[0].min_moisture, 0, 7);
        maxSoilMoisture = response[0].max_moisture;

        minLightIntensity.fill(response[0].min_light, 0, 7);
        maxLightIntensity = response[0].max_light;

        minTemperature.fill(response[0].min_temperature, 0, 7);
        maxTemperature = response[0].max_temperature;

        minHumidity.fill(response[0].min_humidity, 0, 7);
        maxHumidity = response[0].max_humidity;

        fetch("http://127.0.0.1:3000/query/daily_average", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                plant_id: document.getElementById("plantSelect").value.split(" - ")[0]
            }),
        }).then(res => res.json()).then(response => {
            console.log(response);

            if (response.tokenValid == false) {
                alert("Session expired. Please log in again.");
                localStorage.clear();
                window.location.href = "./login.html";
            }
            else if (response.length == 0) {
                alert("No data found for the selected plant.");
            }

            for (let i = 0; i < response.length; i++) {
                dates.push(response[i].date);
                soilMoistureLevels.push(parseFloat(response[i].avg_moisture));
                lightIntensityLevels.push(parseFloat(response[i].avg_light));
                temperatureLevels.push(parseFloat(response[i].avg_temperature));
                humidityLevels.push(parseFloat(response[i].avg_humidity));
            }

            var chartStatus = Chart.getChart("soilMoistureChart");
            if (chartStatus != undefined) {
                chartStatus.destroy();
            }

            //Soil Moisture Level Chart
            var soil_moisture_chart = document.getElementById('soilMoistureChart');
            new Chart(soil_moisture_chart, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Average Soil Moisture Level",
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgba(0,0,255,1.0)",
                        borderColor: "rgba(0,0,255,1.0)",
                        borderWidth: 4,
                        data: soilMoistureLevels,
                    }, {
                        label: "Ideal Soil Moisture Level",
                        data: minSoilMoisture,
                        fill: { value: maxSoilMoisture },
                        lineTension: 0,
                        backgroundColor: "rgba(54, 232, 27, 0.4)",
                        borderColor: "rgba(255, 0, 0,1.0)",
                        borderWidth: 0,
                        pointRadius: 0,
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: true },
                        title: {
                            display: true,
                            text: "Average Soil Moisture Level of the Plant Over the Week",
                            font: { size: 16 },
                            maintainAspectRatio: false
                        },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Date" },
                        },
                        y: {
                            title: { display: true, text: "Soil Moisture Level" },
                            min: 0,
                            max: 1024,
                        }
                    }
                }
            });


            //Light Intensity Level Chart
            chartStatus = Chart.getChart("lightIntensityChart");
            if (chartStatus != undefined) {
                chartStatus.destroy();
            }
            var light_intensity_chart = document.getElementById('lightIntensityChart');
            new Chart(light_intensity_chart, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Average Light Intensity",
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgba(0,0,255,1.0)",
                        borderColor: "rgba(0,0,255,1.0)",
                        borderWidth: 4,
                        data: lightIntensityLevels,
                    }, {
                        label: "Ideal Light Intensity",
                        data: minLightIntensity,
                        fill: { value: maxLightIntensity },
                        lineTension: 0,
                        backgroundColor: "rgba(54, 232, 27, 0.4)",
                        borderColor: "rgba(255, 0, 0,1.0)",
                        borderWidth: 0,
                        pointRadius: 0,
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: true },
                        title: {
                            display: true,
                            text: `Average Intensity of Light the Plant Received Over the Week`,
                            font: { size: 16 },
                            maintainAspectRatio: false
                        },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Date" },
                        },
                        y: {
                            title: { display: true, text: "Light Intensity (lx)" },
                            min: 0,
                            max: 22000,
                        }
                    }
                }
            });

            var chartStatus = Chart.getChart("temperatureChart");
            if (chartStatus != undefined) {
                chartStatus.destroy();
            }

            //Temperature Level Chart
            var temperature_chart = document.getElementById('temperatureChart');
            new Chart(temperature_chart, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Average Temperature",
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgba(0,0,255,1.0)",
                        borderColor: "rgba(0,0,255,1.0)",
                        borderWidth: 4,
                        data: temperatureLevels,
                    }, {
                        label: "Ideal Temperature",
                        data: minTemperature,
                        fill: { value: maxTemperature },
                        lineTension: 0,
                        backgroundColor: "rgba(54, 232, 27, 0.4)",
                        borderColor: "rgba(255, 0, 0,1.0)",
                        borderWidth: 0,
                        pointRadius: 0,
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: true },
                        title: {
                            display: true,
                            text: "Average Temperature Around the Plant Over the Week",
                            font: { size: 16 },
                            maintainAspectRatio: false
                        },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Date" },
                        },
                        y: {
                            title: { display: true, text: "Temperature (°C)" },
                            min: 0,
                            max: 45,
                        }
                    }
                }
            });

            var chartStatus = Chart.getChart("humidityChart");
            if (chartStatus != undefined) {
                chartStatus.destroy();
            }

            //Humidity Level Chart
            var humidity_chart = document.getElementById('humidityChart');
            new Chart(humidity_chart, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Average Humidity",
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgba(0,0,255,1.0)",
                        borderColor: "rgba(0,0,255,1.0)",
                        borderWidth: 4,
                        data: humidityLevels,
                    }, {
                        label: "Ideal Humidity",
                        data: minHumidity,
                        fill: { value: maxHumidity },
                        lineTension: 0,
                        backgroundColor: "rgba(54, 232, 27, 0.4)",
                        borderColor: "rgba(255, 0, 0,1.0)",
                        borderWidth: 0,
                        pointRadius: 0,
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: true },
                        title: {
                            display: true,
                            text: "Average Humidity Around the Plant Over the Week",
                            font: { size: 16 },
                            maintainAspectRatio: false
                        },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Date" },
                        },
                        y: {
                            title: { display: true, text: "Humidity (%)" },
                            min: 0,
                            max: 100,
                        }
                    }
                }
            });
        });
    });
}