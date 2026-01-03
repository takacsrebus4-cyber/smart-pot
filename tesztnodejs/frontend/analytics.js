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
        var current_plants = response.current_plants;

        // Handle token expiration
        if (current_plants.tokenValid == false) {
            alert("You are not authorized to perform this action. Please log in.");
            localStorage.clear();
            window.location.href = "./login.html";
        }
        // Populate the select dropdown with the retrieved plants
        else if (current_plants.length > 0) {
            const plantSelect = document.getElementById("plantSelect");
            plantSelect.innerHTML = ""; // Clear existing options
            current_plants.forEach(plant => {
                const option = document.createElement("option");
                option.value = plant.id + " - " + plant.plant_name;
                option.text = plant.id + " - " + plant.plant_name;
                plantSelect.appendChild(option);
            });
            displayAnalyticsSection();
        } else {
            document.getElementsByClassName("no-data")[0].innerText ="Nem található növény.";
        }
    });
});


document.getElementById("plantSelect").addEventListener("change", function (e) {
    e.preventDefault();
    displayAnalyticsSection();
});




function displayAnalyticsSection() {

    var plant_name = document.getElementById("plantSelect").value.split(" - ")[1];
    console.log("Plant name: " + plant_name);

    var dates = [];

    var soilMoistureLevels = [];
    var lightAmount = [];
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

    var minLightAmount = [0, 0, 0, 0, 0, 0, 0];
    var maxLightAmount = 0;

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
        if (response.tokenValid == false) {
            alert("Jelentkezzen be.");
            localStorage.clear();
            window.location.href = "./login.html";
        }
        console.log("Plant data:");
        console.log(response);

        var analyticsSection = document.getElementsByClassName("analytics-section");

        for (let i = 0; i < analyticsSection.length; i++) {
            analyticsSection[i].style.display = "block";
        }

        minSoilMoisture.fill(response[0].min_soil_moisture, 0, 7);
        maxSoilMoisture = response[0].max_soil_moisture;

        minLightAmount.fill(response[0].min_light_amount, 0, 7);
        maxLightAmount = response[0].max_light_amount;

        minLightIntensity.fill(response[0].min_light_intensity, 0, 7);
        maxLightIntensity = response[0].max_light_intensity;

        minTemperature.fill(response[0].min_temperature, 0, 7);
        maxTemperature = response[0].max_temperature;

        minHumidity.fill(response[0].min_humidity, 0, 7);
        maxHumidity = response[0].max_humidity;

        fetch("http://127.0.0.1:3000/query/daily_summary", {
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
                alert("Jelentkezzen be.");
                localStorage.clear();
                window.location.href = "./login.html";
            }
            else if (response.length == 0) {
                document.getElementsByClassName("no-data")[0].innerText = "Nincs elérhető adat a kiválasztott növényhez.";
                var analyticsSection = document.getElementsByClassName("analytics-section");

                for (let i = 0; i < analyticsSection.length; i++) {
                    analyticsSection[i].style.display = "none";
                }
            }
            else {

                for (let i = 0; i < response.length; i++) {
                    dates.push(response[i].date);
                    soilMoistureLevels.push(parseFloat(response[i].avg_soil_moisture));
                    lightAmount.push(parseFloat(response[i].total_light_amount));
                    lightIntensityLevels.push(parseFloat(response[i].avg_light_intensity));
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
                            label: "Átlagos talajnedvesség",
                            fill: false,
                            lineTension: 0,
                            backgroundColor: "rgba(0,0,255,1.0)",
                            borderColor: "rgba(0,0,255,1.0)",
                            borderWidth: 4,
                            data: soilMoistureLevels,
                        }, {
                            label: "Ideális talajnedvesség",
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
                                text: "Átlagos talajnedvesség a hét folyamán",
                                font: { size: 16 },
                                maintainAspectRatio: false
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Dátum" },
                            },
                            y: {
                                title: { display: true, text: "Talajnedvesség szintje" },
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
                            label: "Átlagos fényintenzitás",
                            fill: false,
                            lineTension: 0,
                            backgroundColor: "rgba(0,0,255,1.0)",
                            borderColor: "rgba(0,0,255,1.0)",
                            borderWidth: 4,
                            data: lightIntensityLevels,
                        }, {
                            label: "Ideális fényintenzitás",
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
                                text: `Átlagos fényintenzitás a hét folyamán`,
                                font: { size: 16 },
                                maintainAspectRatio: false
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Dátum" },
                            },
                            y: {
                                title: { display: true, text: "Fényintezitás (lx)" },
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
                            label: "Átlagos hőmérséklet",
                            fill: false,
                            lineTension: 0,
                            backgroundColor: "rgba(0,0,255,1.0)",
                            borderColor: "rgba(0,0,255,1.0)",
                            borderWidth: 4,
                            data: temperatureLevels,
                        }, {
                            label: "Ideális hőmérséklet",
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
                                text: "Átlagos hőmérséklet a hét folyamán",
                                font: { size: 16 },
                                maintainAspectRatio: false
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Dátum" },
                            },
                            y: {
                                title: { display: true, text: "Hőmérséklet (°C)" },
                                min: 0,
                                max: 35,
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
                            label: "Átlagos páratartalom",
                            fill: false,
                            lineTension: 0,
                            backgroundColor: "rgba(0,0,255,1.0)",
                            borderColor: "rgba(0,0,255,1.0)",
                            borderWidth: 4,
                            data: humidityLevels,
                        }, {
                            label: "Ideális páratartalom",
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
                                text: "Átlagos páratartalom a hét folyamán",
                                font: { size: 16 },
                                maintainAspectRatio: false
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Dátum" },
                            },
                            y: {
                                title: { display: true, text: "Páratartalom (%)" },
                                min: 0,
                                max: 100,
                            }
                        }
                    }
                });

                var chartStatus = Chart.getChart("lightAmountChart");
                if (chartStatus != undefined) {
                    chartStatus.destroy();
                }

                //Light Amount Chart
                var lightAmount_chart = document.getElementById('lightAmountChart');
                new Chart(lightAmount_chart, {
                    type: "line",
                    data: {
                        labels: dates,
                        datasets: [{
                            label: "Fény mennyisége",
                            fill: false,
                            lineTension: 0,
                            backgroundColor: "rgba(0,0,255,1.0)",
                            borderColor: "rgba(0,0,255,1.0)",
                            borderWidth: 4,
                            data: lightAmount,
                        }, {
                            label: "Ideális fénymennyiség",
                            data: minLightAmount,
                            fill: { value: maxLightAmount },
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
                                text: "A növényt ért fény mennyisége a hét folyamán",
                                font: { size: 16 },
                                maintainAspectRatio: false
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Dátum" },
                            },
                            y: {
                                title: { display: true, text: "Fény mennyisége (h)" },
                                min: 0,
                                max: 16,
                            }
                        }
                    }
                });
            }
        });
    });
}