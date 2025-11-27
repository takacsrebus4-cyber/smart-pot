document.getElementById("button").addEventListener("click", async () => {
    const humidity = document.getElementById("humidity").value;
    const light = document.getElementById("light").value;
    const moisture = document.getElementById("moisture").value;
    const temperature = document.getElementById("temperature").value;
    const data = {
        humidity: humidity,
        light: light,
        moisture: moisture,
        temperature: temperature
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