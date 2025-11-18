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

/*document.getElementById("user-avatar").addEventListener("click", function () {
    document.getElementById("userinfo").style.display = 'block';
});*/

