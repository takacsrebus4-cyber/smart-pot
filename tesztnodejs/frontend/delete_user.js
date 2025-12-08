const plant_ids = [];

// Show delete user modal
document.getElementById("delete_user").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.getElementById('delete_user_modal').style.display = 'block';
});


// Hide delete user modal
document.getElementById("cancel_btn").addEventListener("click", function (evt) {
    evt.preventDefault();
    document.getElementById('delete_user_modal').style.display = 'none';
});


// Delete user event listener
document.getElementById("delete_btn").addEventListener("click", async (e) => {
    e.preventDefault();

    // Get all plant IDs of the user
    fetch('http://localhost:3000/current_plant_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
            userid: localStorage.getItem("userid")
        }),
    }).then(res => res.json()).then(response => {
        console.log(response);

        // Handle token expiration
        if (response.tokenValid == false) {
            alert("Session expired. Please log in again.");
            localStorage.clear();
            window.location.href = "./login.html";
        }
        // If plants exist, collect their IDs
        else {
            for (let i = 0; i < response.length; i++) {
                plant_ids.push(response[i].id);
            }
            // Send DELETE request to remove plant data
            fetch('http://localhost:3000/delete/data', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: JSON.stringify({
                    plant_ids: plant_ids,
                }),
            }).then(res => res.json()).then(response => {
                console.log(response);

                // Handle token expiration
                if (response.tokenValid == false) {
                    alert("Session expired. Please log in again.");
                    localStorage.clear();
                    window.location.href = "./login.html";
                }

                // Proceed to delete current plants if data deletion was successful or no data was found
                else if (response.dataFound == false || response.success == true) {
                    fetch('http://localhost:3000/delete/current_plant', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                        },
                        body: JSON.stringify({
                            plant_ids: plant_ids,
                        }),
                    }).then(res => res.json()).then(response => {
                        console.log(response);

                        // Proceed to delete user if current plant deletion was successful or no plants were found
                        if (response.dataFound == false || response.success == true) {
                            fetch('http://localhost:3000/delete/user', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                                },
                                body: JSON.stringify({
                                    userid: localStorage.getItem("userid")
                                }),
                            }).then(res => res.json()).then(response => {
                                console.log(response);
                                if (response.success == true) {
                                    alert("User deleted successfully.");
                                    plant_ids.length = 0;
                                    console.log(plant_ids);
                                    localStorage.clear();
                                    window.location.href = "./login.html";
                                } else {
                                    alert("Error deleting user.");
                                }
                            });
                        } else {
                            alert("Error deleting current plants.");
                        }
                    });
                } else {
                    alert("Error deleting data.");
                }
            });
        }
    });
});