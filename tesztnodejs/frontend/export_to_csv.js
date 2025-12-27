document.getElementById("exportbtn").addEventListener("click", function() {
    var plant_id = document.getElementById("plantSelect").value.split(" - ")[0];

    fetch('http://localhost:3000/export_weekly_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ plant_id: plant_id })
    }).then(res => res.json()).then(response => {
        if (response.tokenValid === false) {
            alert("Jelentkezzen be újra.");
            window.location.href = "login.html";
        }
        else if (response.exportSuccess === true) {
            alert("Az adatok exportálása sikeres! A fájl neve: weekly_data_export.csv");
        }
        else {
            alert("Hiba történt az adatok exportálása során.");
        }
    });
});
        