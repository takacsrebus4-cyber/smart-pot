//const host = "http://127.0.0.1:3000";

// Simple script for interactive elements
document.addEventListener('DOMContentLoaded', function () {
    // Water button functionality
    const waterButtons = document.querySelectorAll('.btn-secondary');
    waterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const plantCard = this.closest('.plant-card');
            const plantName = plantCard.querySelector('.plant-name').textContent;
            alert(`Watering scheduled for ${plantName}`);

            // Simulate watering effect
            const progressFill = plantCard.querySelector('.progress-fill');
            progressFill.style.width = '85%';

            // Update status if it was caution
            if (plantCard.classList.contains('caution')) {
                plantCard.classList.remove('caution');
                const status = plantCard.querySelector('.plant-status');
                status.textContent = 'Healthy';
                status.className = 'plant-status status-healthy';
            }
        });
    });
});


//Plant cards
document.body.onload = function () {
     fetch(`${host}/current_plant_list`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'authorization': 'Bearer ' + localStorage.getItem('accessToken')
         },
         body: JSON.stringify({
             userid: localStorage.getItem('userid')
         }),
     }).then(res => res.json()).then(response => {
         if (response.token_valid == false) {
             alert("Session expired. Please log in again.");
             window.location.href = "login.html";
         }
         else {
             document.getElementById('total-plants').innerText = "" + response.length;

         }
    });
}
