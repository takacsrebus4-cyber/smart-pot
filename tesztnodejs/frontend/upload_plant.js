document.getElementById("button").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const scientific_name = document.getElementById("scientific_name").value;
    const max_humidity = document.getElementById("max_humidity").value;
    const min_humidity = document.getElementById("min_humidity").value;
    const max_light = document.getElementById("max_light").value;
    const min_light = document.getElementById("min_light").value;
    const max_moisture = document.getElementById("max_moisture").value;
    const min_moisture = document.getElementById("min_moisture").value;
    const max_temperature = document.getElementById("max_temperature").value;
    const min_temperature = document.getElementById("min_temperature").value;
    const data = {
        name: name,
        scientific_name: scientific_name,
        max_humidity: max_humidity,
        min_humidity: min_humidity,
        max_light: max_light,
        min_light: min_light,
        max_moisture: max_moisture,
        min_moisture: min_moisture,
        max_temperature: max_temperature,
        min_temperature: min_temperature
    };
    const response = await fetch('http://localhost:3000/upload/plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    console.log(response);
    alert(response);
});