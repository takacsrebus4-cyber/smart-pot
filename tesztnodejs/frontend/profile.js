document.getElementById("dropdown").addEventListener("click", function (e) {
    e.preventDefault();
    var dropdownContent = document.getElementById('dropdown-container');
    var dropdown = document.getElementById('dropdown');
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
        dropdown.classList.remove("active");
    } else {
        dropdownContent.style.display = "block";
        dropdown.classList.add("active");
    }
});

document.getElementById("logged-in-user").innerHTML = "Logged in as <strong>" + localStorage.getItem('username') + "</strong>";