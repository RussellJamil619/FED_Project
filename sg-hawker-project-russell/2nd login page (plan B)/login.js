document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const rememberCheckbox = document.getElementById('remember');
    const termsCheckbox = document.getElementById('terms');

    // Check for remembered credentials
    window.addEventListener('load', function() {
        const rememberedEmail = localStorage.getItem('sgHawkerRememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    });

    // Check password match in real-time
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password) {
            if (password === confirmPassword) {
                this.classList.remove('error');
                this.classList.add('success');
            } else {
                this.classList.add('error');
                this.classList.remove('success');
            }
        } else {
            this.classList.remove('error', 'success');
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const rememberMe = rememberCheckbox.checked;
        const termsAccepted = termsCheckbox.checked;
        
        // Validation
        if (!email) {
            alert('Please enter your email address');
            emailInput.focus();
            return;
        }
        
        if (!email.includes('@')) {
            alert('Please enter a valid email address');
            emailInput.focus();
            return;
        }
        
        if (!password) {
            alert('Please enter your password');
            passwordInput.focus();
            return;
        }
        
        if (!confirmPassword) {
            alert('Please confirm your password');
            confirmPasswordInput.focus();
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            confirmPasswordInput.focus();
            return;
        }
        
        if (!termsAccepted) {
            alert('Please agree to the Terms & Conditions');
            termsCheckbox.focus();
            return;
        }
        
        // Save email if "Remember me" is checked
        if (rememberMe && email) {
            localStorage.setItem('sgHawkerRememberedEmail', email);
        } else {
            localStorage.removeItem('sgHawkerRememberedEmail');
        }
        
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        // Simulate login process
        setTimeout(() => {
            alert(`Login successful!\n\nWelcome to SG Hawker Centre!\nEmail: ${email}`);
            
            // In a real application, you would redirect here
            // window.location.href = 'dashboard.html';
            
            // Reset button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }, 1500);
    });
});