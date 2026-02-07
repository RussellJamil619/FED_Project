// ===== VENDOR ORDERS MANAGEMENT =====
// This file should be saved as order2.js

// Orders data
let vendorOrders = [];
let currentPage = 1;
const ordersPerPage = 8;
let currentSelectedOrder = null;
let refreshInterval = null;
let lastUpdateTime = null;

// Available stores for filtering
const availableStores = [
  "Uncle Tan's Chicken Rice",
  "Aunty Rose's Curry House",
  "Bangkok Street Thai",
  "Malay Corner Nasi Lemak",
  "Kopi & Teh Station"
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log('Vendor Orders Page Initializing...');
  initializeOrders();
  setupEventListeners();
  updateStatistics();
  
  // Start auto-refresh every 15 seconds
  startAutoRefresh();
  
  // Clean up on page unload
  window.addEventListener('beforeunload', cleanup);
});

// Cleanup function
function cleanup() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    console.log('Auto-refresh stopped');
  }
}

// Start auto-refresh every 15 seconds
function startAutoRefresh() {
  refreshInterval = setInterval(() => {
    console.log('Auto-refreshing orders...');
    loadCustomerOrders(true); // Silent refresh
  }, 15000); // 15 seconds
  
  console.log('Auto-refresh started (15 seconds interval)');
}

// Initialize orders
function initializeOrders() {
  console.log('Initializing orders...');
  
  // Load vendor orders from localStorage
  const savedVendorOrders = localStorage.getItem('vendorOrders');
  
  if (savedVendorOrders) {
    try {
      vendorOrders = JSON.parse(savedVendorOrders);
      console.log(`Loaded ${vendorOrders.length} existing vendor orders`);
    } catch (error) {
      console.error('Error loading vendor orders:', error);
      vendorOrders = [];
    }
  } else {
    console.log('No existing vendor orders found');
    vendorOrders = [];
  }
  
  // Load latest customer orders
  loadCustomerOrders();
  displayOrders();
  updateLastUpdatedTime();
}

// Update last updated time
function updateLastUpdatedTime() {
  lastUpdateTime = new Date();
  const timeString = lastUpdateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`Last updated: ${timeString}`);
}

// Save vendor orders to localStorage
function saveVendorOrders() {
  try {
    localStorage.setItem('vendorOrders', JSON.stringify(vendorOrders));
    console.log(`Saved ${vendorOrders.length} vendor orders`);
    updateLastUpdatedTime();
  } catch (error) {
    console.error('Error saving vendor orders:', error);
  }
}

// Load and sync customer orders
function loadCustomerOrders(silent = false) {
  console.log('Loading customer orders...');
  const customerOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  console.log(`Found ${customerOrders.length} customer orders`);
  
  let newOrdersCount = 0;
  let hasUpdates = false;
  
  customerOrders.forEach(customerOrder => {
    // Check if this order already exists in vendor orders
    const existingOrderIndex = vendorOrders.findIndex(o => o.orderNumber === customerOrder.orderNumber);
    
    if (existingOrderIndex === -1) {
      // New order - add to vendor orders
      newOrdersCount++;
      hasUpdates = true;
      
      // Determine store(s) from items
      const storesSet = new Set();
      let storeNames = [];
      
      if (customerOrder.items && customerOrder.items.length > 0) {
        customerOrder.items.forEach(item => {
          if (item.store && item.store.trim() !== '') {
            storesSet.add(item.store);
            storeNames.push(item.store);
          }
        });
      }
      
      // Determine store display logic
      let storeDisplay = '';
      let storeFilter = '';
      
      if (storesSet.size === 0) {
        // No store info - this shouldn't happen with your friend's system
        storeDisplay = 'General Store';
        storeFilter = 'General Store';
      } else if (storesSet.size === 1) {
        // Single store - use that store name
        const storeName = Array.from(storesSet)[0];
        storeDisplay = storeName;
        storeFilter = storeName;
      } else {
        // Multiple stores - show "General Store" in table
        // But store actual store names for filtering
        storeDisplay = 'General Store';
        storeFilter = 'General Store';
        // Store the actual store names separately
        storeNames = Array.from(storesSet);
      }
      
      // Calculate item count
      const itemCount = customerOrder.items ? 
        customerOrder.items.reduce((sum, item) => sum + item.qty, 0) : 0;
      
      // Add to vendor orders
      vendorOrders.push({
        orderNumber: customerOrder.orderNumber,
        storeDisplay: storeDisplay,
        storeFilter: storeFilter,
        actualStores: storeNames, // Store all actual store names
        items: customerOrder.items || [],
        total: customerOrder.total || 0,
        status: customerOrder.status || 'Pending',
        date: customerOrder.date || new Date().toISOString(),
        itemCount: itemCount,
        timestamp: customerOrder.date ? new Date(customerOrder.date).getTime() : Date.now(),
        customerInfo: customerOrder.customerInfo || null
      });
      
      console.log(`Added new order: ${customerOrder.orderNumber} - Store: ${storeDisplay}`);
    } else {
      // Update existing order if needed
      const updated = updateExistingOrder(existingOrderIndex, customerOrder);
      if (updated) {
        hasUpdates = true;
      }
    }
  });
  
  if (hasUpdates) {
    // Sort by most recent first
    vendorOrders.sort((a, b) => b.timestamp - a.timestamp);
    saveVendorOrders();
    displayOrders();
    updateStatistics();
    
    if (newOrdersCount > 0 && !silent) {
      console.log(`Added ${newOrdersCount} new orders`);
      showNotification(`${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} received!`);
    }
  } else if (!silent) {
    console.log('No new or updated orders');
  }
}

// Update existing order with new data
function updateExistingOrder(index, customerOrder) {
  const existingOrder = vendorOrders[index];
  let updated = false;
  
  // Update items if changed
  if (JSON.stringify(customerOrder.items) !== JSON.stringify(existingOrder.items)) {
    existingOrder.items = customerOrder.items;
    existingOrder.total = customerOrder.total || 0;
    existingOrder.itemCount = customerOrder.items ? 
      customerOrder.items.reduce((sum, item) => sum + item.qty, 0) : 0;
    updated = true;
    
    // Recalculate store info if items changed
    const storesSet = new Set();
    let storeNames = [];
    
    if (customerOrder.items && customerOrder.items.length > 0) {
      customerOrder.items.forEach(item => {
        if (item.store && item.store.trim() !== '') {
          storesSet.add(item.store);
          storeNames.push(item.store);
        }
      });
    }
    
    // Update store display logic
    if (storesSet.size === 0) {
      existingOrder.storeDisplay = 'General Store';
      existingOrder.storeFilter = 'General Store';
      existingOrder.actualStores = [];
    } else if (storesSet.size === 1) {
      const storeName = Array.from(storesSet)[0];
      existingOrder.storeDisplay = storeName;
      existingOrder.storeFilter = storeName;
      existingOrder.actualStores = [storeName];
    } else {
      existingOrder.storeDisplay = 'General Store';
      existingOrder.storeFilter = 'General Store';
      existingOrder.actualStores = Array.from(storesSet);
    }
  }
  
  return updated;
}

// Show notification
function showNotification(message) {
  // Remove existing notification
  const existingNotif = document.querySelector('.notification');
  if (existingNotif) existingNotif.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-bell"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease;
    font-weight: 600;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Display orders in table
function displayOrders() {
  const tableBody = document.getElementById('ordersTableBody');
  const noOrdersRow = document.getElementById('noOrdersRow');
  const storeFilter = document.getElementById('storeFilter');
  const filterValue = storeFilter ? storeFilter.value : '';
  
  // Filter orders
  let filteredOrders = vendorOrders;
  if (filterValue) {
    filteredOrders = vendorOrders.filter(order => {
      if (filterValue === '') return true;
      
      // Check store filter
      if (order.storeFilter === filterValue) return true;
      
      // For "General Store" filter, check if it contains multiple stores
      if (filterValue === 'General Store' && order.actualStores && order.actualStores.length > 1) {
        return true;
      }
      
      // Check actual stores array
      if (order.actualStores && order.actualStores.includes(filterValue)) {
        return true;
      }
      
      return false;
    });
  }
  
  // Pagination
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  // Update pagination controls
  updatePaginationControls(filteredOrders.length);
  
  // Clear table
  tableBody.innerHTML = '';
  
  // Show empty state if no orders
  if (paginatedOrders.length === 0) {
    noOrdersRow.style.display = '';
    tableBody.appendChild(noOrdersRow);
    return;
  }
  
  // Hide empty state row
  noOrdersRow.style.display = 'none';
  
  // Add each order to table
  paginatedOrders.forEach(order => {
    const row = createOrderRow(order);
    tableBody.appendChild(row);
  });
}

// Create table row for an order
function createOrderRow(order) {
  const row = document.createElement('tr');
  row.dataset.orderId = order.orderNumber;
  
  // Format date
  const dateObj = new Date(order.timestamp);
  const timeString = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Status badge
  const statusClass = getStatusClass(order.status);
  
  // Determine store display class
  const isGeneralStore = order.storeDisplay === 'General Store';
  const storeClass = isGeneralStore ? 'general-store' : 'single-store';
  const storeTitle = isGeneralStore && order.actualStores && order.actualStores.length > 1 
    ? `Multiple stores: ${order.actualStores.join(', ')}`
    : order.storeDisplay;
  
  row.innerHTML = `
    <td><strong class="order-number">${order.orderNumber}</strong></td>
    <td><span class="store-display ${storeClass}" title="${storeTitle}">${order.storeDisplay}</span></td>
    <td class="item-count">${order.itemCount} item${order.itemCount !== 1 ? 's' : ''}</td>
    <td><strong class="order-total">$${order.total ? order.total.toFixed(2) : '0.00'}</strong></td>
    <td><span class="status-badge ${statusClass}">${order.status}</span></td>
    <td class="order-time">${timeString}</td>
    <td>
      <div class="action-buttons">
        <button class="btn-view" onclick="viewOrderDetails('${order.orderNumber}')">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="btn-update" onclick="openUpdateModal('${order.orderNumber}')">
          <i class="fas fa-edit"></i> Update
        </button>
        <button class="btn-delete" onclick="deleteOrder('${order.orderNumber}')">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </td>
  `;
  
  return row;
}

// Delete an order
function deleteOrder(orderNumber) {
  if (!confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
    return;
  }
  
  const index = vendorOrders.findIndex(o => o.orderNumber === orderNumber);
  if (index !== -1) {
    vendorOrders.splice(index, 1);
    saveVendorOrders();
    displayOrders();
    updateStatistics();
    
    // Close modal if open
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
    if (modal) modal.hide();
    
    showNotification(`Order ${orderNumber} deleted successfully!`);
  }
}

// Get CSS class for status badge
function getStatusClass(status) {
  const statusLower = (status || '').toLowerCase();
  switch(statusLower) {
    case 'pending':
      return 'status-pending';
    case 'preparing':
      return 'status-preparing';
    case 'ready-to-collect':
    case 'ready':
      return 'status-ready';
    case 'completed':
    case 'collected':
      return 'status-completed';
    default:
      return 'status-pending';
  }
}

// Update statistics display
function updateStatistics() {
  const storeFilter = document.getElementById('storeFilter');
  const filterValue = storeFilter ? storeFilter.value : '';
  
  let filteredOrders = vendorOrders;
  if (filterValue) {
    filteredOrders = vendorOrders.filter(order => {
      if (filterValue === '') return true;
      if (order.storeFilter === filterValue) return true;
      if (filterValue === 'General Store' && order.actualStores && order.actualStores.length > 1) return true;
      if (order.actualStores && order.actualStores.includes(filterValue)) return true;
      return false;
    });
  }
  
  document.getElementById('totalOrders').textContent = filteredOrders.length;
  document.getElementById('pendingOrders').textContent = 
    filteredOrders.filter(o => o.status === 'Pending').length;
  document.getElementById('preparingOrders').textContent = 
    filteredOrders.filter(o => o.status === 'Preparing').length;
  document.getElementById('readyOrders').textContent = 
    filteredOrders.filter(o => o.status === 'Ready-to-collect' || o.status === 'Ready').length;
}

// Update pagination controls
function updatePaginationControls(totalOrders) {
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageIndicator = document.getElementById('currentPage');
  
  pageIndicator.textContent = currentPage;
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// View order details
function viewOrderDetails(orderNumber) {
  const order = vendorOrders.find(o => o.orderNumber === orderNumber);
  if (!order) {
    alert('Order not found!');
    return;
  }
  
  // Set modal content
  document.getElementById('modalOrderNumber').textContent = order.orderNumber;
  document.getElementById('modalOrderNumber2').textContent = order.orderNumber;
  
  // Display store info - show actual stores if multiple
  let storeDisplayText = order.storeDisplay;
  if (order.actualStores && order.actualStores.length > 1) {
    storeDisplayText = `${order.storeDisplay} (${order.actualStores.join(', ')})`;
  }
  document.getElementById('modalStore').textContent = storeDisplayText;
  
  document.getElementById('modalTotal').textContent = `$${order.total.toFixed(2)}`;
  document.getElementById('modalStatus').innerHTML = `
    <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
  `;
  
  // Format date
  const dateObj = new Date(order.timestamp);
  const formattedDate = dateObj.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('modalTime').textContent = formattedDate;
  
  // Populate items
  const itemsList = document.getElementById('modalItemsList');
  itemsList.innerHTML = '';
  
  if (order.items && order.items.length > 0) {
    order.items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'modal-item';
      const storeInfo = item.store ? `<div class="modal-item-store">From: ${item.store}</div>` : '';
      itemDiv.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          ${storeInfo}
        </div>
        <div style="text-align: center;">
          <strong>Qty:</strong> ${item.qty}
        </div>
        <div style="text-align: right;">
          <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      `;
      itemsList.appendChild(itemDiv);
    });
  } else {
    itemsList.innerHTML = '<p class="text-muted">No items found in this order.</p>';
  }
  
  // Store current order for status updates
  currentSelectedOrder = order;
  
  // Highlight current status button
  highlightCurrentStatus(order.status);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
  modal.show();
}

// Open update modal
function openUpdateModal(orderNumber) {
  viewOrderDetails(orderNumber);
}

// Highlight current status in modal
function highlightCurrentStatus(status) {
  document.querySelectorAll('.btn-status').forEach(btn => {
    btn.classList.remove('active');
    const btnStatus = btn.dataset.status.toLowerCase();
    const currentStatus = (status || '').toLowerCase();
    
    if (
      (btnStatus === 'ready' && (currentStatus === 'ready' || currentStatus === 'ready-to-collect')) ||
      btnStatus === currentStatus
    ) {
      btn.classList.add('active');
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Store filter
  const storeFilter = document.getElementById('storeFilter');
  if (storeFilter) {
    storeFilter.addEventListener('change', function() {
      currentPage = 1;
      displayOrders();
      updateStatistics();
    });
  }
  
  // Pagination
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        displayOrders();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const totalPages = Math.ceil(vendorOrders.length / ordersPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        displayOrders();
      }
    });
  }
  
  // Status buttons in modal
  document.querySelectorAll('.btn-status').forEach(btn => {
    btn.addEventListener('click', function() {
      const status = this.dataset.status;
      
      // Update all status buttons
      document.querySelectorAll('.btn-status').forEach(b => {
        b.classList.remove('active');
      });
      this.classList.add('active');
      
      // Update order status
      if (currentSelectedOrder) {
        currentSelectedOrder.status = status;
      }
    });
  });
  
  // Save status button
  const saveStatusBtn = document.getElementById('saveStatus');
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', function() {
      if (currentSelectedOrder) {
        // Update the order in vendorOrders array
        const index = vendorOrders.findIndex(o => o.orderNumber === currentSelectedOrder.orderNumber);
        if (index !== -1) {
          vendorOrders[index].status = currentSelectedOrder.status;
          saveVendorOrders();
          displayOrders();
          updateStatistics();
          
          // Close modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
          if (modal) modal.hide();
          
          showNotification(`✅ Order ${currentSelectedOrder.orderNumber} status updated to "${currentSelectedOrder.status}"`);
        }
      }
    });
  }
  
  // Delete order button in modal
  const deleteOrderBtn = document.getElementById('deleteOrderBtn');
  if (deleteOrderBtn) {
    deleteOrderBtn.addEventListener('click', function() {
      if (currentSelectedOrder) {
        deleteOrder(currentSelectedOrder.orderNumber);
      }
    });
  }
}

// Add notification styles to head
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
document.head.appendChild(style);

// Debugging functions
function addTestOrders() {
  const testOrders = [
    {
      orderNumber: 'ORD001',
      storeDisplay: "Uncle Tan's Chicken Rice",
      storeFilter: "Uncle Tan's Chicken Rice",
      actualStores: ["Uncle Tan's Chicken Rice"],
      items: [
        { name: 'Hainanese Chicken Rice', price: 5.00, qty: 1, store: "Uncle Tan's Chicken Rice" }
      ],
      total: 5.00,
      status: 'Ready-to-collect',
      itemCount: 1,
      timestamp: Date.now() - 3600000
    },
    {
      orderNumber: 'ORD002',
      storeDisplay: "Aunty Rose's Curry House",
      storeFilter: "Aunty Rose's Curry House",
      actualStores: ["Aunty Rose's Curry House"],
      items: [
        { name: 'Chicken Curry', price: 6.50, qty: 1, store: "Aunty Rose's Curry House" },
        { name: 'Fish Curry', price: 7.00, qty: 1, store: "Aunty Rose's Curry House" }
      ],
      total: 13.50,
      status: 'Preparing',
      itemCount: 2,
      timestamp: Date.now() - 1800000
    },
    {
      orderNumber: 'ORD003',
      storeDisplay: 'General Store',
      storeFilter: 'General Store',
      actualStores: ["Uncle Tan's Chicken Rice", "Kopi & Teh Station"],
      items: [
        { name: 'Hainanese Chicken Rice', price: 5.00, qty: 1, store: "Uncle Tan's Chicken Rice" },
        { name: 'Teh Tarik', price: 1.50, qty: 2, store: "Kopi & Teh Station" }
      ],
      total: 8.00,
      status: 'Preparing',
      itemCount: 3,
      timestamp: Date.now() - 900000
    }
  ];
  
  // Add test orders if they don't exist
  testOrders.forEach(testOrder => {
    if (!vendorOrders.some(order => order.orderNumber === testOrder.orderNumber)) {
      vendorOrders.push({
        ...testOrder,
        date: new Date(testOrder.timestamp).toISOString()
      });
    }
  });
  
  // Sort and save
  vendorOrders.sort((a, b) => b.timestamp - a.timestamp);
  saveVendorOrders();
  displayOrders();
  updateStatistics();
  
  showNotification('Test orders added successfully!');
}

// Make functions available globally for debugging
window.addTestOrders = addTestOrders;
window.resetVendorOrders = function() {
  if (confirm('Are you sure you want to clear all vendor orders? This cannot be undone.')) {
    vendorOrders = [];
    currentPage = 1;
    saveVendorOrders();
    displayOrders();
    updateStatistics();
    console.log('Vendor orders cleared');
  }
};

window.manualRefresh = function() {
  console.log('Manual refresh triggered');
  loadCustomerOrders();
  showNotification('Orders refreshed!');
};