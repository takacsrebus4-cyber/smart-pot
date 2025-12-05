const dates = [];
const soilMoistureLevels = [];
const lightIntensityLevels = [];
const temperatureLevels = [];
const humidityLevels = [];


document.body.onload = function (e) {
    e.preventDefault();
    document.getElementById("loadbtn").click();
}

document.getElementById("loadbtn").addEventListener("click", function (e) {
    e.preventDefault();
    fetch("http://127.0.0.1:3000/query/daily_average", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(response => {
        console.log(response);


        for (let i = 0; i < response.length; i++) {
            dates.push(response[i].date);
            soilMoistureLevels.push(parseFloat(response[i].avg_moisture));
            lightIntensityLevels.push(parseFloat(response[i].avg_light));
            temperatureLevels.push(parseFloat(response[i].avg_temperature));
            humidityLevels.push(parseFloat(response[i].avg_humidity));
        }

        const minSoilMoisture = Array(dates.length).fill(200);
        const maxSoilMoisture = 800;
        const minLightIntensity = Array(dates.length).fill(20);
        const maxLightIntensity = 200;


        //Soil Moisture Level Chart
        const soil_moisture_chart = document.getElementById('soilMoistureChart');
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
                        title: { display: true, text: "Soil Moisture Level (%)" },
                        min: 0,
                        max: 1024,
                    }
                }
            }
        });

        //Light Intensity Level Chart
        const light_intensity_chart = document.getElementById('lightIntensityChart');
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
                    label: "Ideal Moisture Level",
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
                        text: "Average Intensity of Light the Plant Received Over the Week",
                        font: { size: 16 },
                        maintainAspectRatio: false
                    },
                },
                scales: {
                    x: {
                        title: { display: true, text: "Date" },
                    },
                    y: {
                        title: { display: true, text: "Light Intensity (lux)" },
                        min: 0,
                        max: 300,
                    }
                }

            }
        });
    });
});