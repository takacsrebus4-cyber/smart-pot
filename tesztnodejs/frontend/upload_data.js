document.getElementById("button").addEventListener("click", async () => {
    const current_plant_id = 3; //document.getElementById("current_plant_id").value;
    const humidity = document.getElementById("humidity").value;
    const light = document.getElementById("light").value;
    const moisture = document.getElementById("moisture").value;
    const temperature = document.getElementById("temperature").value;
    const timestamp = new Date().toISOString();
    const data = {
        timestamp: timestamp,
        humidity: humidity,
        light: light,
        moisture: moisture,
        temperature: temperature,
        current_plant_id: current_plant_id
    };
    const response = await fetch('http://localhost:3000/upload/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    console.log(response)
});