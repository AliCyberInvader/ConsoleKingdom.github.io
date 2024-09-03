document.getElementById('changePasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const messageElement = document.getElementById('message');

    // Hash the current password
    const currentPasswordHash = CryptoJS.SHA256(currentPassword).toString();

    // Get the email of the logged-in user from localStorage
    const email = localStorage.getItem('email');

    // Retrieve the user array from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the user object based on the email
    let user = users.find(u => u.email === email);

    if (user) {
        // Check if the hashed current password matches the stored hash
        if (user.password === currentPasswordHash) {
            // Check if new password is at least 8 characters long
            if (newPassword.length >= 8) {
                // Check if new password and confirm password match
                if (newPassword === confirmNewPassword) {
                    // Hash the new password
                    const newPasswordHash = CryptoJS.SHA256(newPassword).toString();

                    // Update the user's password with the new hashed password
                    user.password = newPasswordHash;

                    // Save the updated user array back to localStorage
                    localStorage.setItem('users', JSON.stringify(users));

                    messageElement.textContent = "Password changed successfully!";
                    messageElement.style.color = "green";

                    // Redirect to login page after 1 second and log out the user
                    setTimeout(() => {
                        window.location.replace("login.html");
                        localStorage.setItem('isLoggedIn', false);
                        localStorage.removeItem('productsArr');
                        localStorage.removeItem('bundlesArr');
                        localStorage.removeItem('username');
                    }, 1000);
                } else {
                    messageElement.textContent = "New passwords do not match!";
                }
            } else {
                messageElement.textContent = "New password must be at least 8 characters long!";
            }
        } else {
            messageElement.textContent = "Current password is incorrect!";
        }
    } else {
        messageElement.textContent = "User not found!";
    }
});
