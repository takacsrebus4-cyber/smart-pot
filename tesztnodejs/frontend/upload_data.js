document.getElementById("button").addEventListener("click", async () => {
    const data = {
        humidity: document.getElementById("humidity").value,
        light: document.getElementById("light").value,
        moisture: document.getElementById("moisture").value,
        temperature: document.getElementById("temperature").value
    };
    const response = await fetch('http://localhost:3000/upload/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    console.log("Data uploaded successfully!");    
});