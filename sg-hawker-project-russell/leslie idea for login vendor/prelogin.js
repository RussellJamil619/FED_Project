// DOM elements
const signInBtn = document.getElementById('signInBtn');
const createAccountBtn = document.getElementById('createAccountBtn');
const signInModal = document.getElementById('signInModal');
const createAccountModal = document.getElementById('createAccountModal');
const closeBtns = document.querySelectorAll('.close-btn');
const signInForm = document.getElementById('signInForm');
const createAccountForm = document.getElementById('createAccountForm');
const successMessage = document.getElementById('successMessage');

// Open Sign In Modal
signInBtn.addEventListener('click', () => {
    signInModal.style.display = 'flex';
});

// Open Create Account Modal
createAccountBtn.addEventListener('click', () => {
    createAccountModal.style.display = 'flex';
});

// Close modals when clicking X
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        signInModal.style.display = 'none';
        createAccountModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === signInModal) {
        signInModal.style.display = 'none';
    }
    if (event.target === createAccountModal) {
        createAccountModal.style.display = 'none';
    }
});

// Handle Sign In form submission
signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real application, you would send this data to a server
    console.log('Sign In attempt with:', { email, password });
    
    // Show a success message
    alert('Sign in successful!');
    
    // Close modal and reset form
    signInModal.style.display = 'none';
    signInForm.reset();
});

// Handle Create Account form submission
createAccountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('newName').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // In a real application, you would send this data to a server
    console.log('Account creation attempt with:', { name, email, password });
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Close modal and reset form
    createAccountModal.style.display = 'none';
    createAccountForm.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});

// Simple animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in effect
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});