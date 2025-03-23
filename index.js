//Initial Data
const masterUser = "admin" // master username
const masterPass = "supersecret" // master password

// Handle login form submission
document.getElementById('login-form').addEventListener("submit", function(e) {
    e.preventDefault(); // don't refresh the page

    // Get the username and password from the form inputs
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Check if the username and password match
    if (username === masterUser && password === masterPass) {
        logActivity("Logged in!"); // log the successful login
        showMain(); // show the main app if login is successful
        console.log('logged in!');
    } else {
        alert("Incorrect username or password"); // if login fails
        logActivity("Failed login attempt"); // log the failure
    }
});

// Show the main app after login
function showMain() {
    document.getElementById("login-page").style.display = "none"; // hide the login form
    document.getElementById("main-container").style.display = "flex"; // show the main container
}

// Ensure Account Management is displayed when its button is clicked
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function () {
        const feature = button.getAttribute('data-feature'); // get the feature name
        if (feature === 'account-management') {
            displayAccounts();  // show Account Management content
        }
    });
});

// Function to log activity (just writes a message to the log panel)
function logActivity(message) {
    const log = document.getElementById('activity-log'); // get the activity log container
    const newLogItem = document.createElement('p'); // create a new log entry
    newLogItem.textContent = message; // set the text of the log entry
    log.appendChild(newLogItem); // add the log entry to the log
}

// Handle button clicks for switching between features
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function() {
        const feature = button.getAttribute('data-feature'); // get the selected feature
        loadFeatureContent(feature); // load the feature's content
    });
});

// Dynamically load content based on the selected feature
function loadFeatureContent(feature) {
    const contentArea = document.getElementById('dynamic-content'); // get the content area

    // Show different content depending on the selected feature
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
        window.location.reload();  // reload the page to simulate logout
        logActivity('Logged out.');
    }
}

// QR Code generator (for backups)
function generateQRCode() {
    let encryptedData = localStorage.getItem('encryptedPasswords');  // grab encrypted data from localStorage

    // Create a QR code
    let qr = new QRious({
        element: document.getElementById('qrcode'),  // target the canvas
        value: encryptedData,  // the data to encode
        size: 200  // size of the QR code
    });

    // Show the QR code
    document.getElementById('qrcode').style.display = 'block';
}

// Sample JSON data for accounts
let accountsData = {
    accounts: [
        {
            service: "Google",
            username: "ethan ade",
            password: "supersecret123",
            notes: "My personal Google account",
            tags: ["social", "personal"]
        },
        {
            service: "Gmail",
            username: "john.doe@gmail.com",
            password: "emailPassword321!",
            notes: "Primary email account",
            tags: ["email", "work"]
        }
    ]
};

// Save the account data in localStorage (pretend this is encrypted)
localStorage.setItem('accountData', JSON.stringify(accountsData));

// Get the stored account data (also pretend this is encrypted)
let storedAccountData = JSON.parse(localStorage.getItem('accountData'));

// Check if the data exists and log it
if (storedAccountData) {
    console.log(storedAccountData);
}

// Function to display accounts in the Account Management panel
function displayAccounts() {
    let storedAccountData = JSON.parse(localStorage.getItem('accountData'));  // Get the account data from localStorage
    const contentArea = document.getElementById('dynamic-content');  // The dynamic content area

    // Clear previous content
    contentArea.innerHTML = '';

    // Add account form
    let addAccountForm = `
        <h1>Account Management</h1>
        <form id="add-account-form">
            <input type="text" id="new-service" placeholder="Service Name" required>
            <input type="text" id="new-username" placeholder="Username" required>
            <input type="password" id="new-password" placeholder="Password" required>
            <input type="text" id="new-notes" placeholder="Notes">
            <input type="text" id="new-tags" placeholder="Tags (comma separated)">
            <button type="submit">Add Account</button> <!-- This is the submit button -->
        </form>
        <hr>
    `;

    contentArea.innerHTML += addAccountForm;  // Add the form to the content area

    // Check the console to verify form is added correctly
    console.log('Add account form HTML:', addAccountForm);

    // Form submission handling for adding a new account
    document.getElementById('add-account-form').addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page refresh

        // Get values from the input fields
        const service = document.getElementById('new-service').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        const notes = document.getElementById('new-notes').value;
        const tags = document.getElementById('new-tags').value;

        // Add the new account to the stored data
        addNewAccount(service, username, password, notes, tags);

        // Clear the form after submission
        document.getElementById('add-account-form').reset();

        // Refresh the display of accounts
        displayAccounts();
        console.log('Displaying accounts...');  // Log when displayAccounts() is called
    });

    // If accounts exist, display them
    if (storedAccountData && storedAccountData.accounts.length > 0) {
        storedAccountData.accounts.forEach(account => {
            let accountHTML = `
                <div class="account-entry">
                    <h3>${account.service}</h3>
                    <p><strong>Username:</strong> ${account.username}</p>
                    <p><strong>Password:</strong> ${account.password}</p>
                    <p><strong>Notes:</strong> ${account.notes}</p>
                    <p><strong>Tags:</strong> ${account.tags.join(', ')}</p>
                </div>
                <hr>
            `;
            contentArea.innerHTML += accountHTML;  // Append each account
        });
    } else {
        contentArea.innerHTML = '<p>No accounts stored.</p>';
    }
}


// Function to add a new account to localStorage
function addNewAccount(service, username, password, notes, tags) {
    let storedAccountData = JSON.parse(localStorage.getItem('accountData')) || { accounts: [] }; // Get existing accounts

    // Create the new account
    const newAccount = {
        service: service,
        username: username,
        password: password,
        notes: notes,
        tags: tags
    };

    // Add the new account to the list
    storedAccountData.accounts.push(newAccount);

    // Save the updated list back to localStorage
    localStorage.setItem('accountData', JSON.stringify(storedAccountData));

    console.log('New account data:', service, username, password, notes, tags); // Debug
}
