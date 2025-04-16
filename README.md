# SecurePass

**SecurePass** is a lightweight, secure password manager designed to store passwords locally in your browser. It utilizes AES-256 encryption to ensure your data is kept safe and never stored on external servers. With features like password strength checks, password generation, backup, and restore, SecurePass aims to make password management both secure and user-friendly.

---

## Features

- **AES-256 Encryption**: All passwords are securely stored locally in your browser and encrypted usingAES-256 encryption.
- **Backup and Restore**: Export your encrypted password vault as a `.json` file and restore it when needed.
- **Password Generation**: Automatically generate strong, random passwords with a click of a button.
- **Password Strength Checker**: Check the strength of passwords before storing them to ensure they are secure.
- **User-Friendly Interface**: A clean and simple interface that makes password management easier for everyone.
- **Zero-Knowledge Architecture**: No sensitive data is stored in the cloud; all encryption is handled locally.

---

## Installation

To run SecurePass locally:

1. Clone this repository:

   ```bash
   git clone https://github.com/yeni-dev/securepass-manager.git
   ```

2. Open the `index.html` file in your preferred browser.

   SecurePass doesn't require any server-side setup; it runs entirely in your browser.

---

## How It Works

- **User Login**: When you first set up SecurePass, you will login with a master password and username. This password is 'super' and the username is 'admin' this will be used to generate an encryption key for encrypting your password vault.
- **Password Storage**: Your passwords are stored as encrypted entries in the browser's local storage. These entries are only accessible after re-authenticating with your master password.
- **Backup and Restore**: Your encrypted password data can be exported to a `.json` file, allowing you to keep a backup of your vault. You can later restore this data by uploading the `.json` file and decrypting it with your master password.

---

## Usage

**Add Passwords**: Go to the **Account Management** page, click "Add Account," and input the credentials you want to save.
**Backup Your Vault**: Click the "Backup" button to export your encrypted password vault as a `.json` file.
**Restore Your Vault**: Use the "Restore" option to load your previously backed-up data and decrypt it with your master password.
**Password Generation**: Use the password generator to create strong, random passwords. You can check their strength and ensure they are not reused.

---


## Future Enhancements

- **Two-Factor Authentication**: Integrate 2FA to further secure the password manager.
- **Mobile Version**: Improve the mobile responsiveness for better access on smartphones.
- **Password Health Recommendations**: Provide users with actionable suggestions to improve weak passwords.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
