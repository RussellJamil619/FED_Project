// ============ SAME CONFIG HERE ============
const firebaseConfig = {
  apiKey: "AIzaSyAQJ_5bvld7FvcJAgex7RPO0rPyXLxZOjc",
  authDomain: "russellfedproject.firebaseapp.com",
  projectId: "russellfedproject",
  storageBucket: "russellfedproject.firebasestorage.app",
  messagingSenderId: "645071996143",
  appId: "1:645071996143:web:1942c9aa7902c5b200471a",
  measurementId: "G-RCVB4JTSWG"
};
// ==========================================

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Check if user is logged in
auth.onAuthStateChanged((user) => {
    const loginCheck = document.getElementById('loginCheck');
    const mainContent = document.querySelector('main');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const loginLink = document.getElementById('loginLink');
    
    if (user) {
        // User IS logged in
        if (loginCheck) loginCheck.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        if (userInfo) {
            userInfo.style.display = 'block';
            if (userName) userName.textContent = `Hi, ${user.email.split('@')[0]}`;
        }
        if (loginLink) loginLink.style.display = 'none';
    } else {
        // User is NOT logged in
        if (loginCheck) loginCheck.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
        if (loginLink) loginLink.style.display = 'flex';
    }
});

// Logout function
function logout() {
    auth.signOut().then(() => {
        alert('Logged out!');
        window.location.href = 'index.html';
    });
}

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Orders page loaded');
    
    // Add logout button event
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Add click handlers to Update buttons
    const updateButtons = document.querySelectorAll('.btn-edit');
    updateButtons.forEach(button => {
        button.addEventListener('click', handleUpdateClick);
    });
    
    // Add click handlers to View buttons
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', handleViewClick);
    });
    
    // Add click handlers to feedback links
    const feedbackLinks = document.querySelectorAll('.view-link');
    feedbackLinks.forEach(link => {
        link.addEventListener('click', handleFeedbackClick);
    });
});

// Handle Update button click (keep your existing function)
function handleUpdateClick(event) {
    // Find the order ID from the table row
    const orderId = this.closest('tr').querySelector('td strong').textContent;
    alert(`Update order ${orderId}: Select new status and save changes.`);
}

// Handle View button click (keep your existing function)
function handleViewClick(event) {
    // Find the order details from the table row
    const row = this.closest('tr');
    const orderId = row.querySelector('td strong').textContent;
    const customer = row.querySelector('td:nth-child(2)').textContent;
    const items = row.querySelector('td:nth-child(3)').textContent;
    const status = row.querySelector('.status-badge').textContent;
    
    // Show order details
    alert(`Order Details:\n\nOrder ID: ${orderId}\nCustomer: ${customer}\nItems: ${items}\nStatus: ${status}`);
}

// Handle Feedback link click (keep your existing function)
function handleFeedbackClick(event) {
    event.preventDefault(); // Stop the link from navigating
    
    // Find customer name
    const customerName = this.closest('.customer-item').querySelector('.customer-name').textContent;
    
    // Show feedback message
    alert(`Feedback from ${customerName}:\n\n"Great food! Very tasty and delivered on time."\n\nRating: ⭐⭐⭐⭐⭐ (5/5)`);
}