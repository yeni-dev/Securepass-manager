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

//handling nav buttons to switch panels
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function(){
        const feature = button.getAttribute('data-feature');
        loadFeatureContent(feature); //call functionto load the selected feature
    });
});

// function the load content dynamically based on selected feature
function loadFeatureContent(feature) {
    const contentArea = document.getElementById('dynamic-content');  // Get the dynamic content area

    // Switch content based on the feature selected
    if (feature === 'account-management') {
        contentArea.innerHTML = `<h1>Account Management</h1><p>Manage your stored accounts here.</p>`;
        logActivity('Accessed Account Management.');
    } else if (feature === 'password-generator-health') {
        contentArea.innerHTML = `<h1>Password Generator & Health</h1><p>Generate strong passwords and check password health.</p>`;
        logActivity('Accessed Password Generator & Health.');
    } else if (feature === 'backup-restore') {
        contentArea.innerHTML = `
            <h1>Backup & Restore</h1>
            <p>Backup or restore your data securely. Generate a QR code for backup.</p>
            <button onclick="generateQRCode()">Generate QR Code for Backup</button>
            <canvas id="qrcode" style="display:none;"></canvas>
        `;
        logActivity('Accessed Backup & Restore.');
    } else if (feature === 'two-factor-auth') {
        contentArea.innerHTML = `<h1>Two-Factor Authentication</h1><p>Set up two-factor authentication for extra security.</p>`;
        logActivity('Accessed Two-Factor Authentication.');
    } else if (feature === 'settings') {
        contentArea.innerHTML = `<h1>Settings</h1><p>Manage application settings here.</p>`;
        logActivity('Accessed Settings.');
    } else if (feature === 'logout') {
        window.location.reload();  // Reload the page to simulate logout
        logActivity('Logged out.');
    }
}

// Function to generate the QR code from encrypted JSON data
function generateQRCode() {
    // Let's assume encryptedData is the stringified JSON of encrypted account data
    let encryptedData = localStorage.getItem('encryptedPasswords');  // Retrieve your encrypted JSON data

    // Create the QR code on the canvas element
    let qr = new QRious({
        element: document.getElementById('qrcode'),  // Target the canvas element
        value: encryptedData,  // The data to encode into the QR code
        size: 200  // Size of the QR code
    });

    // Show the QR code canvas (hidden by default)
    document.getElementById('qrcode').style.display = 'block';
}
