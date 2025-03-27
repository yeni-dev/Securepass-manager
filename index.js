// Master login details for demonstration purposes
const masterUser = "admin";
const masterPass = "super";

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


// Open an existing vault
function createNewVault(vaultName) {
    if (vaultName) {
        let vaults = JSON.parse(localStorage.getItem('vaults')) || [];
        vaults.push(vaultName + ".json");
        localStorage.setItem('vaults', JSON.stringify(vaults));

        // Create the vault in localStorage (unencrypted)
        const vaultData = { accounts: [] };
        localStorage.setItem(vaultName + '.json', JSON.stringify(vaultData));
        openVault(vaultName + ".json");
    }
    logActivity("Creating vault");
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
        logActivity("account management accessed");
    } else if (feature === 'password-generator-health') {
        passwordGeneratorAndHealth();
    } else if (feature === 'backup-restore') {
        displayBackupRestoreOptions();
    } else if (feature === 'settings') {
        displaySettings(); // Placeholder for settings
    } else if (feature === 'logout') {
        // Clear session data (clear current vault and login state)
        localStorage.removeItem('currentVault');

        // Hide vault selection and account management UI
        document.getElementById('dynamic-content').innerHTML = '';

        // Show login page again
        document.getElementById('login-page').style.display = 'block';

        // Log activity and simulate the logout
        logActivity('Logged out.');

        // Optionally, refresh the page to reset any other state
        window.location.reload();
    }
}


// Display accounts in the Account Management section
// Display accounts in the Account Management section
function displayAccounts(vaultData) {
    const contentArea = document.getElementById('dynamic-content');
    contentArea.innerHTML = '<h1>Account Management</h1>';

    // Add form to create new accounts (always visible at the top)
    contentArea.innerHTML += `
        <h3>Add New Account</h3>
        <form id="add-account-form">
            <input type="text" id="new-service" placeholder="Service Name" required>
            <input type="text" id="new-username" placeholder="Username" required>
            <input type="password" id="new-password" placeholder="Password" required>
            <button type="submit">Add Account</button>
        </form>
        <button id="view-json-btn">View Vault JSON</button> <!-- View JSON Vault Button -->
        <hr>
        <div id="accounts-container" style="max-height: 400px; overflow-y: auto;">
            <!-- Accounts will be dynamically added here -->
        </div>
    `;

    const accountsContainer = document.getElementById('accounts-container');

    // Display existing accounts
    if (vaultData && vaultData.accounts.length > 0) {
        vaultData.accounts.forEach(account => {
            accountsContainer.innerHTML += `
                <div>
                    <h3>${account.service}</h3>
                    <p><strong>Username:</strong> ${account.username}</p>
                    <p><strong>Password:</strong> ${account.password}</p>
                </div>
                <hr>
            `;
        });
    } else {
        accountsContainer.innerHTML = '<p>No accounts stored.</p>';
    }

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
        const vaultData = JSON.parse(localStorage.getItem(vaultName));
        alert(`Vault JSON: \n${JSON.stringify(vaultData)}`);
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
        
        <h2 onclick="restoreVaultFromFile()">Restore Vault</h2>
        <input type="file" id="restore-file-input">
    `;

    // Handle restoring from file input
    document.getElementById('restore-file-input').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            restoreVaultFromFile(file);
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

        const blob = new Blob([vaultData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = backupName;
        link.click();
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

// Restore vault from a backup file
function restoreVaultFromFile() {
    const fileInput = document.getElementById('restore-file-input');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const fileContent = event.target.result;

            // Create a text box and a button to ask for vault name
            const restoreForm = document.createElement('div');
            restoreForm.innerHTML = `
                <label for="vault-name-input">Enter vault name for the restored file:</label>
                <input type="text" id="vault-name-input" placeholder="Vault Name" required>
                <button id="restore-vault-btn">Restore Vault</button>
            `;

            // Append the form to the content area (or another element on the page)
            const contentArea = document.getElementById('dynamic-content');
            contentArea.innerHTML = ''; // Clear any previous content
            contentArea.appendChild(restoreForm);

            // Handle the restore action when the user submits the vault name
            document.getElementById('restore-vault-btn').addEventListener('click', function () {
                const vaultName = document.getElementById('vault-name-input').value.trim();
                if (vaultName) {
                    localStorage.setItem(vaultName + '.json', fileContent);
                    openVault(vaultName + '.json');
                    logActivity("Restored vault: " + vaultName);
                } else {
                    alert("Vault name cannot be empty.");
                }
            });
        };
        reader.readAsText(file);
    }
}



// Function to log activity
function logActivity(message) {
    const log = document.getElementById('activity-log');
    const newLogItem = document.createElement('p');
    newLogItem.textContent = message;
    log.appendChild(newLogItem);
}

function passwordGeneratorAndHealth() {
    const contentArea = document.getElementById('dynamic-content');

    // Create the content for password evaluation
    contentArea.innerHTML = `
        <h1>Password Generator & Health</h1>
        <p>Enter a password to evaluate:</p>
        <input type="text" id="password-input" placeholder="Enter password" required>
        <button id="evaluate-password-btn">Evaluate Password</button>
        <div id="password-result"></div>
    `;

    // Ensure that the button click works properly
    document.getElementById('evaluate-password-btn').addEventListener('click', function() {
        const password = document.getElementById('password-input').value.trim(); // Get the value of the input field
        const resultDiv = document.getElementById('password-result'); // Result output area

        // Check if password input is not empty
        if (password) {
            const strength = evaluatePasswordStrength(password);
            const health = checkPasswordHealth(password);

            // Show the results of evaluation
            resultDiv.innerHTML = `<p>Password strength: ${strength}</p><p>Password health: ${health}</p>`;
        } else {
            resultDiv.innerHTML = '<p>Please enter a password to evaluate.</p>'; // Message if no password is entered
        }
    });
}

// Evaluate password strength
function evaluatePasswordStrength(password) {
    if (password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password)) {
        return "Strong";
    } else if (password.length >= 6) {
        return "Medium";
    } else {
        return "Weak";
    }
}

// Check if password is reused in any stored account
function checkPasswordHealth(password) {
    const vaultName = localStorage.getItem('currentVault');
    if (!vaultName) {
        return "No vault selected.";
    }
    const vaultData = JSON.parse(localStorage.getItem(vaultName));
    const reused = vaultData.accounts.some(account => account.password === password);
    return reused ? "Password is reused" : "Healthy";
}



function displaySettings() {
    const contentArea = document.getElementById('dynamic-content');

    // Create the settings content
    contentArea.innerHTML = `
        <h1>Settings</h1>
        <p><strong>Warning:</strong> Clearing local storage will remove all vaults and data. This action cannot be undone!</p>
        <label for="master-password">Enter master password to confirm:</label>
        <input type="password" id="master-password" placeholder="Master Password" required>
        <button id="clear-local-storage-btn">Clear All Local Storage</button>
    `;

    // Handle clearing local storage with password check
    document.getElementById('clear-local-storage-btn').addEventListener('click', function () {
        const enteredPassword = document.getElementById('master-password').value;

        if (enteredPassword === masterPass) {
            if (confirm("Are you sure you want to clear all local storage? This action cannot be undone.")) {
                localStorage.clear();  // Clear all data in local storage
                logActivity("All local storage has been cleared.");
                alert("Local storage has been cleared.");
            }
        } else {
            alert("Incorrect master password.");
        }
    });
}
