document.getElementById("button").addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
        humidity: document.getElementById("humidity").value,
        light_amount: document.getElementById("light_amount").value,
        light_intensity: document.getElementById("light_intensity").value,
        soil_moisture: document.getElementById("soil_moisture").value,
        temperature: document.getElementById("temperature").value
    };
    fetch('http://localhost:3000/upload/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        console.log(response);
        if (response.success == true) {
            alert("Data uploaded successfully.");
        }
        else {
            alert("Error uploading data.");
        }
    });
});