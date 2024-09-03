document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const popup = document.getElementById('popup-message');
    const popupText = document.getElementById('popup-text');
    const closePopup = document.getElementById('close-popup');
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = passwordField.value;

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showPopup('Invalid email format');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);

        if (user) {
            const hashedPassword = CryptoJS.SHA256(password).toString();
            if (user.password === hashedPassword) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', user.name); 
                localStorage.setItem('email', user.email); 

                showPopup('Sign in successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); 
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                showPopup('Incorrect password');
            }
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            showPopup('Email does not exist');
        }
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    togglePassword.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        // Toggle the eye icon
        togglePassword.classList.toggle('bx-show');
        togglePassword.classList.toggle('bx-hide');
    });

    function showPopup(message) {
        popupText.textContent = message;
        popup.style.display = 'block';
    }
});
