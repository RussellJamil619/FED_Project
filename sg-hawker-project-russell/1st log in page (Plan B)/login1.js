// Get the login form
const loginForm = document.getElementById('loginForm');

// Handle form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Show login message
    alert(`Login submitted!\nEmail: ${email}\nRemember me: ${remember ? 'Yes' : 'No'}`);
    
    // Reset form
    loginForm.reset();
});

// On page load, check if there's a remembered email in localStorage
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
});

// Save email when "Remember me" is checked
document.getElementById('remember').addEventListener('change', function() {
    const email = document.getElementById('email').value;
    if (this.checked && email) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});