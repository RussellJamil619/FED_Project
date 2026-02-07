// script.js - Simple JavaScript for the orders page

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Orders page loaded');
    
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

// Handle Update button click
function handleUpdateClick(event) {
    // Find the order ID from the table row
    const orderId = this.closest('tr').querySelector('td strong').textContent;
    alert(`Update order ${orderId}: Select new status and save changes.`);
}

// Handle View button click
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

// Handle Feedback link click
function handleFeedbackClick(event) {
    event.preventDefault(); // Stop the link from navigating
    
    // Find customer name
    const customerName = this.closest('.customer-item').querySelector('.customer-name').textContent;
    
    // Show feedback message
    alert(`Feedback from ${customerName}:\n\n"Great food! Very tasty and delivered on time."\n\nRating: ⭐⭐⭐⭐⭐ (5/5)`);
}