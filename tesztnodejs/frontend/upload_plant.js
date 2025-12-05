document.getElementById("button").addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById("name").value,
        scientific_name: document.getElementById("scientific_name").value,
        max_humidity: document.getElementById("max_humidity").value,
        min_humidity: document.getElementById("min_humidity").value,
        max_light: document.getElementById("max_light").value,
        min_light: document.getElementById("min_light").value,
        max_moisture: document.getElementById("max_moisture").value,
        min_moisture: document.getElementById("min_moisture").value,
        max_temperature: document.getElementById("max_temperature").value,
        min_temperature: document.getElementById("min_temperature").value
    };
    fetch('http://localhost:3000/upload/plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(response => {
        console.log(response);
        if(response.success){
            alert("Plant uploaded successfully!");
        }
        else{
            alert("Failed to upload plant.");
        }
    });
});