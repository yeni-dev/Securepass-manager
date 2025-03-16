//Initial Data
const masterUser = "admin" // defines the master username
const masterPass = "supersecret" // defines the master passwrod

//Login form handling
document.getElementById('login-form').addEventListener("submit", function(e) {
    e.preventDefault(); //stops form refreshing page


    //get enter input
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    //check if the input is correct
    if (username == masterUser && password == masterPass) {
        logActivity("Logged in!");
        showMain(); //show the main application on successful login
    }else{
        alert("incorrect username and password");
        logActivity("Failed login attempt")
    }
});
    //show the main section after login
function showMain() {
    document.getElementById("login-page").style.display = "none"; //hide login
    document.getElementById("main-container").style.display = "flex"; //show main

}


//function to log activity to the activity log in the left panel
function logActivity(message) {
    const log = document.getElementById('activity-log')
    const newLogItem = document.createElement('p');
    newLogItem.textContent = message;
    log.appendChild(newLogItem);
}



