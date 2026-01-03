document.getElementById("arduinoSelect").addEventListener("change", function () {
    var selecterdArduino = document.getElementById("arduinoSelect").value.split(" - ")[0];
    var selectedPlantId = document.getElementById("arduinoSelect").value.split(" - ")[1];

    fetch('http://localhost:3000/assign_arduino_to_plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            plant_id: selectedPlantId,
            arduino_mac: selecterdArduino
        })
    }).then(res => res.json()).then(response => {
        if (response.tokenValid === false) {
            alert("Érvénytelen token. Kérjük, jelentkezzen be újra.");
        }
        else if (response.success) {
            alert("Arduino sikeresen hozzárendelve a növényhez.");
        }
        else {
            alert("Hiba történt az Arduino hozzárendelése során.");
        }
    });
});
