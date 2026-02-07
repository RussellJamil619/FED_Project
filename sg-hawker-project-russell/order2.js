// script.js - Corporate Orders Management System

document.addEventListener('DOMContentLoaded', function() {
    console.log('Orders Management System Loaded');
    
    // Initialize all event listeners
    initEventListeners();
    updateStatsDisplay();
    
    // Simulate loading orders
    simulateDataLoading();
});

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Filter buttons
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Table action buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', handleViewOrder);
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', handleEditOrder);
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDeleteOrder);
    });
    
    // Export buttons
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('printOrders').addEventListener('click', printOrders);
    
    // Modal close buttons
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Status update form
    document.getElementById('updateStatusForm').addEventListener('submit', handleStatusUpdate);
}

// ===== DATA HANDLING =====
function simulateDataLoading() {
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.classList.remove('loading');
        }, index * 100);
    });
}

function updateStatsDisplay() {
    const pending = document.querySelectorAll('.status-pending').length;
    const preparing = document.querySelectorAll('.status-preparing').length;
    const ready = document.querySelectorAll('.status-ready').length;
    const completed = document.querySelectorAll('.status-completed').length;
    
    // Update stats cards (in a real app, these would come from server)
    document.querySelectorAll('.stat-value')[0].textContent = document.querySelectorAll('.orders-table tbody tr').length;
    document.querySelectorAll('.stat-value')[1].textContent = pending;
    document.querySelectorAll('.stat-value')[2].textContent = preparing;
    document.querySelectorAll('.stat-value')[3].textContent = ready;
}

// ===== FILTER FUNCTIONS =====
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    const rows = document.querySelectorAll('.orders-table tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let showRow = true;
        
        // Filter by status
        if (statusFilter && statusFilter !== 'all') {
            const status = row.querySelector('.status-badge').className;
            if (!status.includes(statusFilter)) {
                showRow = false;
            }
        }
        
        // Filter by search
        if (searchFilter) {
            const orderId = row.cells[0].textContent.toLowerCase();
            const customer = row.cells[1].textContent.toLowerCase();
            const items = row.cells[2].textContent.toLowerCase();
            
            if (!orderId.includes(searchFilter) && 
                !customer.includes(searchFilter) && 
                !items.includes(searchFilter)) {
                showRow = false;
            }
        }
        
        // Show/hide row
        if (showRow) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show filter results
    showNotification(`${visibleCount} orders found`, 'info');
}

function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchFilter').value = '';
    
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    showNotification('Filters reset', 'success');
}

// ===== ORDER ACTIONS =====
function handleViewOrder(event) {
    const row = event.target.closest('tr');
    const orderId = row.cells[0].textContent;
    const customer = row.cells[1].textContent;
    const items = row.cells[2].textContent;
    const status = row.cells[3].querySelector('.status-badge').textContent;
    const total = row.cells[4].textContent;
    
    // Populate modal with order details
    document.getElementById('modalOrderId').textContent = orderId;
    document.getElementById('modalCustomer').textContent = customer;
    document.getElementById('modalItems').textContent = items;
    document.getElementById('modalStatus').textContent = status;
    document.getElementById('modalTotal').textContent = total;
    document.getElementById('modalTime').textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Set status color
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.className = 'status-badge ' + row.cells[3].querySelector('.status-badge').className.split(' ')[1];
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewOrderModal'));
    modal.show();
    
    showNotification(`Viewing order ${orderId}`, 'info');
}

function handleEditOrder(event) {
    const row = event.target.closest('tr');
    const orderId = row.cells[0].textContent;
    const customer = row.cells[1].textContent;
    const currentStatus = row.cells[3].querySelector('.status-badge').className.split(' ')[1].replace('status-', '');
    
    // Populate edit modal
    document.getElementById('editOrderId').textContent = orderId;
    document.getElementById('editCustomer').textContent = customer;
    document.getElementById('statusSelect').value = currentStatus;
    document.getElementById('editNotes').value = '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    modal.show();
    
    showNotification(`Editing order ${orderId}`, 'warning');
}

function handleStatusUpdate(event) {
    event.preventDefault();
    
    const orderId = document.getElementById('editOrderId').textContent;
    const newStatus = document.getElementById('statusSelect').value;
    const notes = document.getElementById('editNotes').value;
    
    // Find and update the row
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === orderId) {
            const statusCell = row.cells[3];
            const oldStatus = statusCell.querySelector('.status-badge').className.split(' ')[1];
            
            // Update status badge
            const newBadge = document.createElement('span');
            newBadge.className = `status-badge status-${newStatus}`;
            newBadge.textContent = formatStatusText(newStatus);
            
            statusCell.innerHTML = '';
            statusCell.appendChild(newBadge);
            
            // Add note if provided
            if (notes.trim()) {
                const noteIcon = document.createElement('i');
                noteIcon.className = 'fas fa-sticky-note ms-2 text-warning';
                noteIcon.title = notes;
                statusCell.appendChild(noteIcon);
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
            modal.hide();
            
            showNotification(`Order ${orderId} updated to ${formatStatusText(newStatus)}`, 'success');
            updateStatsDisplay();
            return;
        }
    });
}

function handleDeleteOrder(event) {
    const row = event.target.closest('tr');
    const orderId = row.cells[0].textContent;
    
    if (confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) {
        row.style.opacity = '0.5';
        row.style.pointerEvents = 'none';
        
        setTimeout(() => {
            row.remove();
            showNotification(`Order ${orderId} deleted`, 'danger');
            updateStatsDisplay();
        }, 500);
    }
}

// ===== EXPORT FUNCTIONS =====
function exportToCSV() {
    const rows = document.querySelectorAll('.orders-table tbody tr');
    let csv = 'Order ID,Customer,Items,Status,Total,Time\n';
    
    rows.forEach(row => {
        const cells = row.cells;
        const rowData = [
            cells[0].textContent,
            cells[1].textContent,
            cells[2].textContent.replace(/,/g, ';'),
            cells[3].querySelector('.status-badge').textContent,
            cells[4].textContent,
            new Date().toLocaleTimeString()
        ];
        csv += rowData.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification('Orders exported to CSV', 'success');
}

function printOrders() {
    window.print();
    showNotification('Printing orders...', 'info');
}

// ===== UTILITY FUNCTIONS =====
function formatStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'preparing': 'Preparing',
        'ready': 'Ready to Collect',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    });
}

// ===== DATA SIMULATION (for demo) =====
function addSampleOrder() {
    const sampleOrders = [
        {
            id: 'ORD004',
            customer: 'Jane Smith',
            items: 'Chicken Satay (x4), Teh Tarik (x2)',
            status: 'pending',
            total: '$24.00'
        },
        {
            id: 'ORD005',
            customer: 'Robert Chan',
            items: 'Hainanese Chicken Rice (x1)',
            status: 'preparing',
            total: '$6.50'
        }
    ];
    
    const tableBody = document.querySelector('.orders-table tbody');
    
    sampleOrders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td><span class="status-badge status-${order.status}">${formatStatusText(order.status)}</span></td>
            <td><strong>${order.total}</strong></td>
            <td>Just now</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view"><i class="fas fa-eye"></i> View</button>
                    <button class="btn-action btn-edit"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action btn-delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Reattach event listeners
        row.querySelector('.btn-view').addEventListener('click', handleViewOrder);
        row.querySelector('.btn-edit').addEventListener('click', handleEditOrder);
        row.querySelector('.btn-delete').addEventListener('click', handleDeleteOrder);
    });
    
    updateStatsDisplay();
    showNotification('Sample orders added', 'info');
}

// Expose addSampleOrder for demo
window.addSampleOrder = addSampleOrder;