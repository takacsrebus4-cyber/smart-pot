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

            // Notification bell
            const notificationIcon = document.querySelector('.notification-icon');
            notificationIcon.addEventListener('click', function () {
                alert('You have 3 alerts:\n- Snake Plant needs water\n- Fiddle Leaf Fig temperature high\n- Calathea humidity low');
            });
        });

        /*document.getElementById("user-avatar").addEventListener("click", function () {
            document.getElementById("userinfo").style.display = 'block';
        });*/

        let refreshToken = "asd";

        document.getElementById("dashboard").addEventListener("click", function (evt) {
            fetch('http://127.0.0.1:3000/getUserinfo', {
                method: 'GET',
                headers: {
                    'Connention': 'keep-alive',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'User-Agent': 'Microsoft Edge/141.0.3537.99, Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/'
                },
                body: null,
            }).then(res => res.json()).then(response => {
                refreshToken = response.refreshToken;
                console.log(`Refresh token received: ${response.refreshToken}`);
                console.log(response.accessToken);
                fetch('http://127.0.0.1:5000/validateToken', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + response.accessToken,
                        'Connention': 'keep-alive',
                        'Accept': '*/*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'User-Agent': 'Microsoft Edge/141.0.3537.99, Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/'
                    },
                    body: null,
                }).then(res => res.json()).then(response => {
                    if (response.tokenValid === false) {
                        if (response.refreshTokenValid === false) {
                            // window.location.href = "./login.html";
                            alert("Both tokens are invalid, redirecting to login page...");
                        }
                        else {
                            alert("Access token expired, but refresh token is valid. Generating new access token...");
                            console.log(refreshToken);
                            //Here we should generate a new access token using the refresh token
                            fetch('http://localhost:3000/refreshToken', {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + refreshToken,
                                    'Connention': 'keep-alive',
                                    'Accept': '*/*',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'User-Agent': 'Microsoft Edge/141.0.3537.99, Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/'    
                                },
                                body: null,
                            }).then(res => res.json()).then(response => {
                                console.log("New access token generated:");
                                console.log(response.accessToken);
                                //localStorage.setItem("accessToken", JSON.stringify(response.accessToken));
                            });
                        }
                    }
                    else {
                        alert("Access token is valid.");
                    }
                });
            });
        });
