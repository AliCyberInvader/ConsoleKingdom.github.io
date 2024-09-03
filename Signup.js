document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const customAlert = document.getElementById('custom-alert');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertButton = document.getElementById('custom-alert-button');
    const passwordStrengthAlert = document.getElementById('password-strength-alert');
    const passwordStrengthMessage = document.getElementById('password-strength-message');
    const passwordStrengthButton = document.getElementById('password-strength-button');

    // Define a maximum password length
    const MAX_PASSWORD_LENGTH = 128; // Example limit, adjust as needed

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        // Check for internet connection
        if (!navigator.onLine) {
            showAlert('Internet Connection Problem.Check up your connection!');
            return;
        }

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate name (Unicode letters, spaces, hyphens, and apostrophes)
        const namePattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u;
        if (!namePattern.test(name) || name.length < 2 || name.length > 50) {
            showAlert('Invalid name. It should be 2 to 50 characters long and only contain letters, spaces, hyphens, and apostrophes.\nExample: John Doe, O\'Connor, Mary-Jane');
            return;
        }

        // Validates email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showAlert('Invalid email address');
            return;
        }

        // Validate phone number (5 to 16 digits, ignoring spaces, dashes, and +)
        const cleanedPhone = phone.replace(/[\s\-+()]/g, ''); 
        if (cleanedPhone.length < 5 || cleanedPhone.length > 16 || !/^\d+$/.test(cleanedPhone)) {
            showAlert('Invalid phone number. It should contain between 5 and 16 digits.\nExample: +123456789012');
            return;
        }

        // Check password length
        if (password.length > MAX_PASSWORD_LENGTH) {
            showAlert(`Password is too long. It should be up to ${MAX_PASSWORD_LENGTH} characters.`);
            return;
        }

        // Check password strength
        const passwordStrength = evaluatePasswordStrength(password);
        if (passwordStrength !== 'Strong') {
            showPasswordStrengthAlert(passwordStrength);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match');
            return;
        }

        // Retrieve existing data from local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            // Check if the password matches
            const hashedPassword = CryptoJS.SHA256(password).toString();
            if (existingUser.password === hashedPassword) {
                showAlert('User already signed up. Redirecting to sign in...');
                setTimeout(() => {
                    window.location.href = 'Signin.html';
                }, 2000);
            } else {
                showAlert('Email is already being used!');
            }
        } else {
            // Hash the password
            const hashedPassword = CryptoJS.SHA256(password).toString();

            // Save the new user with hashed password
            const userData = {
                name,
                email,
                phone: cleanedPhone,
                password: hashedPassword
            };
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            showAlert('Signup successful! Redirecting to sign in...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });

    function showAlert(message) {
        customAlertMessage.textContent = message;
        customAlert.style.display = 'flex';
    }

    function showPasswordStrengthAlert(strengthMessage) {
        passwordStrengthMessage.innerHTML = `Password Strength: ${strengthMessage}<br>Please improve your password 
        to meet the following criteria:<br>
        - a minimum of 8 characters<br>
        - including at least one uppercase letter<br>
        - one lowercase letter<br>
        - one number<br>
        - one special character (e.g., !, @, #).<br>
        For example, a strong password could be: P@ssw0rd!123.`;
    
        // Forced text alignment to the left using inline style
        passwordStrengthMessage.style.textAlign = 'left';
        passwordStrengthAlert.style.display = 'flex';
    }
    

    customAlertButton.addEventListener('click', () => {
        customAlert.style.display = 'none';
    });

    passwordStrengthButton.addEventListener('click', () => {
        passwordStrengthAlert.style.display = 'none';
    });

    function evaluatePasswordStrength(password) {
        const lengthCriteria = password.length >= 8;
        const uppercaseCriteria = /[A-Z]/.test(password);
        const lowercaseCriteria = /[a-z]/.test(password);
        const numberCriteria = /\d/.test(password);
        const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = 'Weak';

        if (lengthCriteria && uppercaseCriteria && lowercaseCriteria && numberCriteria && specialCharacterCriteria) {
            strength = 'Strong';
        } else if (lengthCriteria && (uppercaseCriteria || lowercaseCriteria) && (numberCriteria || specialCharacterCriteria)) {
            strength = 'Medium';
        }

        return strength;
    }
});
function togglePasswordVisibility(inputId, iconElement) {
    var passwordField = document.getElementById(inputId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        iconElement.classList.replace('bx-hide', 'bx-show'); // Switch to the "hide" icon
    } else {
        passwordField.type = 'password';
        iconElement.classList.replace('bx-show', 'bx-hide'); // Switch to the "show" icon
    }
}
