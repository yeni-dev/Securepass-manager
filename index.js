// Master login details for demonstration purposes
const masterUser = "admin";
const masterPass = "supersecret";

// Handle Login
document.getElementById('login-form').addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === masterUser && password === masterPass) {
        logActivity("Logged in!");
        document.getElementById('login-page').style.display = 'none'; // Hide login form
        displayVaultSelection(); // Show vault selection form
    } else {
        alert("Incorrect username or password");
    }
});

function logActivity(message) {
    const log = document.getElementById('activity-log'); // get the activity log container
    const newLogItem = document.createElement('p'); // create a new log entry
    newLogItem.textContent = message; // set the text of the log entry
    log.appendChild(newLogItem); // add the log entry to the log

    // Ensure the latest log entry is visible (auto scroll to bottom)

// Add some log entries to simulate activity
    logActivity("Test log #1");
    logActivity("Test log #2");
    logActivity("Test log #3");
    logActivity("Test log #4");
    logActivity("Test log #5");

}

// Display form for selecting or creating vaults
function displayVaultSelection() {
    const contentArea = document.getElementById('dynamic-content');
    let vaults = JSON.parse(localStorage.getItem('vaults')) || [];

    // Create the form dynamically
    let formHTML = `<h1>Select or Create a Vault</h1>`;

    // Show existing vaults if available
    if (vaults.length > 0) {
        formHTML += `<h3>Existing Vaults</h3><form id="select-vault-form"><select id="vault-selector">`;
        vaults.forEach(vault => {
            formHTML += `<option value="${vault}">${vault}</option>`;
        });
        formHTML += `</select><button type="submit">Open Vault</button></form>`;
    } else {
        formHTML += `<p>No vaults available. Create a new one below.</p>`;
    }

    // Form for creating a new vault
    formHTML += `
        <h3>Create New Vault</h3>
        <form id="create-vault-form">
            <input type="text" id="new-vault-name" placeholder="Vault Name" required>
            <button type="submit">Create Vault</button>
        </form>
    `;

    contentArea.innerHTML = formHTML;

    // Handle opening an existing vault
    if (vaults.length > 0) {
        document.getElementById('select-vault-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const selectedVault = document.getElementById('vault-selector').value;
            openVault(selectedVault);
        });
    }

    // Handle creating a new vault
    document.getElementById('create-vault-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const vaultName = document.getElementById('new-vault-name').value;
        createNewVault(vaultName);
    });
}

// Create a new vault
function createNewVault(vaultName) {
    if (vaultName) {
        let vaults = JSON.parse(localStorage.getItem('vaults')) || [];
        vaults.push(vaultName + ".json");
        localStorage.setItem('vaults', JSON.stringify(vaults));

        // Create the vault in localStorage (unencrypted for now)
        localStorage.setItem(vaultName + '.json', JSON.stringify({ accounts: [] }));
        openVault(vaultName + ".json");
    }
}

// Open an existing vault
function openVault(vaultName) {
    logActivity(`Opened vault: ${vaultName}`);
    const vaultData = localStorage.getItem(vaultName);
    if (vaultData) {
        // Store the current vault name in localStorage
        localStorage.setItem('currentVault', vaultName);
        displayAccounts(JSON.parse(vaultData));
    } else {
        alert("Vault not found.");
    }
}

// Setup navigation for different panels

document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function() {
        const feature = button.getAttribute('data-feature'); // get the selected feature
            loadFeatureContent(feature); // load the feature's content
    });
});


// Function to switch between active panels
function loadFeatureContent(feature) {
    const contentArea = document.getElementById('dynamic-content'); // The dynamic content area

    if (feature === 'account-management') {
        const vaultName = localStorage.getItem('currentVault');
        const vaultData = JSON.parse(localStorage.getItem(vaultName));
        displayAccounts(vaultData);
    } else if (feature === 'password-generator-health') {
        passwordGeneratorAndHealth();
    } else if (feature === 'backup-restore') {
        displayBackupRestoreOptions();
    } else if (feature === 'settings') {
        displaySettings(); // Placeholder for settings
    } else if (feature === 'logout') {
        encryptAndLogout();  // Placeholder for logout functionality
    }
}

function encryptAndLogout() {
    //encryption

    window.location.reload();  // reload the page to simulate logout
    logActivity('Logged out.');
}





// Display accounts in the Account Management section
function displayAccounts(vaultData) {
    const contentArea = document.getElementById('dynamic-content');
    contentArea.innerHTML = '<h1>Account Management</h1>';

    // Display existing accounts
    if (vaultData && vaultData.accounts.length > 0) {
        vaultData.accounts.forEach(account => {
            contentArea.innerHTML += `
                <div>
                    <h3>${account.service}</h3>
                    <p><strong>Username:</strong> ${account.username}</p>
                    <p><strong>Password:</strong> ${account.password}</p>
                </div>
                <hr>
            `;
        });
    } else {
        contentArea.innerHTML += '<p>No accounts stored.</p>';
    }

    // Add form to create new accounts
    contentArea.innerHTML += `
        <h3>Add New Account</h3>
        <form id="add-account-form">
            <input type="text" id="new-service" placeholder="Service Name" required>
            <input type="text" id="new-username" placeholder="Username" required>
            <input type="password" id="new-password" placeholder="Password" required>
            <button type="submit">Add Account</button>
        </form>
        <button id="view-json-btn">View Vault JSON</button> <!-- View JSON Vault Button -->
    `;

    // Handle adding new accounts
    document.getElementById('add-account-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const service = document.getElementById('new-service').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        addNewAccount(service, username, password);
    });

    // Handle viewing the raw JSON for the current vault
    document.getElementById('view-json-btn').addEventListener('click', function () {
        const vaultName = localStorage.getItem('currentVault');
        const vaultData = localStorage.getItem(vaultName);
        alert(`Vault JSON: \n${vaultData}`);
    });
}

// Add a new account to the vault
function addNewAccount(service, username, password) {
    const vaultName = localStorage.getItem('currentVault');
    let vaultData = JSON.parse(localStorage.getItem(vaultName));

    const newAccount = { service, username, password };
    vaultData.accounts.push(newAccount);

    localStorage.setItem(vaultName, JSON.stringify(vaultData));
    displayAccounts(vaultData);  // Refresh the account list
}

// Handle Backup & Restore
function displayBackupRestoreOptions() {
    const contentArea = document.getElementById('dynamic-content');
    contentArea.innerHTML = `
        <h1>Backup & Restore</h1>
        <button onclick="backupVault()">Backup Vault</button>
        <input type="file" id="restore-file-input">
        <button onclick="restoreVaultFromFile()">Restore Vault</button>
    `;

    // Handle restoring from file input
    document.getElementById('restore-file-input').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            restoreVault(file);
        }
    });
}

// Backup the current vault
function backupVault() {
    const vaultName = localStorage.getItem('currentVault');
    const vaultData = localStorage.getItem(vaultName);

    if (vaultData) {
        // Create a backup with timestamp
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const backupName = `${vaultName}_backup_${timestamp}.json`;

        // For now, no encryption, just save the JSON
        saveToFile(vaultData, backupName);
        alert("Backup created successfully.");
    } else {
        alert("No vault to back up.");
    }
}

// Save JSON file to disk
function saveToFile(data, filename) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Restore vault from a backup
function restoreVaultFromFile() {
    const fileInput = document.getElementById('restore-file-input');
    const file = fileInput.files[0];
    if (file) {
        restoreVault(file);
    }
}

// Restore vault from a backup file
function restoreVault(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const vaultData = e.target.result;
        const vaultName = prompt("Enter name for the restored vault:");
        if (vaultName) {
            localStorage.setItem(vaultName + '.json', vaultData);
            openVault(vaultName + ".json");
        }
    };
    reader.readAsText(file);
}

// Placeholder for encryption and decryption
function encryptData(data) {
    console.log("Encrypting data...");
    return btoa(data); // Base64 as a placeholder
}

function decryptData(data) {
    console.log("Decrypting data...");
    return atob(data); // Base64 as a placeholder
}

// Function to log activity
function logActivity(message) {
    console.log(message);
}

// Placeholder for password generator & health
function passwordGeneratorAndHealth() {
    const contentArea = document.getElementById('dynamic-content');
    contentArea.innerHTML = `<h1>Password Generator & Health</h1>`;

    const password = prompt("Enter a password to evaluate:");
    const strength = evaluatePasswordStrength(password);
    const health = checkPasswordHealth(password);
    contentArea.innerHTML += `<p>Password strength: ${strength}, Health: ${health}</p>`;
}

function evaluatePasswordStrength(password) {
    if (password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password)) {
        return "Strong";
    } else if (password.length >= 6) {
        return "Medium";
    } else {
        return "Weak";
    }
}

function checkPasswordHealth(password) {
    const vaultName = localStorage.getItem('currentVault');
    const vaultData = JSON.parse(localStorage.getItem(vaultName));
    const reused = vaultData.accounts.some(account => account.password === password);
    return reused ? "Password is reused" : "Healthy";
}
