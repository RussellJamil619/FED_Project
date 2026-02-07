// ===== FOOD DATA BY CATEGORY =====
let foodByCategory = {
  chicken: [
    { name: "Hainanese Chicken Rice", price: 5.00, img: "images/chicken1.jpg", store: "Uncle Tan's Chicken Rice" },
    { name: "Roasted Chicken Rice", price: 5.00, img: "images/chicken2.jpg", store: "Uncle Tan's Chicken Rice" },
    { name: "Steamed Chicken Rice", price: 6.00, img: "images/chicken3.jpg", store: "Uncle Tan's Chicken Rice" },
    { name: "Chicken Porridge", price: 2.00, img: "images/chicken4.jpg", store: "Uncle Tan's Chicken Rice" }
  ],
  curry: [
    { name: "Chicken Curry", price: 6.50, img: "images/curry1.jpg", store: "Aunty Rose's Curry House" },
    { name: "Fish Curry", price: 7.00, img: "images/curry2.jpg", store: "Aunty Rose's Curry House" },
    { name: "Mutton Curry", price: 7.50, img: "images/curry3.jpg", store: "Aunty Rose's Curry House" },
    { name: "Vegetable Curry", price: 5.50, img: "images/curry4.jpg", store: "Aunty Rose's Curry House" }
  ],
  thai: [
    { name: "Pad Thai", price: 6.00, img: "images/thai1.jpg", store: "Bangkok Street Thai" },
    { name: "Tom Yum Soup", price: 5.50, img: "images/thai2.jpg", store: "Bangkok Street Thai" },
    { name: "Green Curry", price: 7.00, img: "images/thai3.jpg", store: "Bangkok Street Thai" },
    { name: "Mango Sticky Rice", price: 4.50, img: "images/thai4.jpg", store: "Bangkok Street Thai" }
  ],
  nasi: [
    { name: "Nasi Lemak with Chicken", price: 5.00, img: "images/nasilemak1.jpg", store: "Malay Corner Nasi Lemak" },
    { name: "Nasi Lemak with Fish", price: 5.50, img: "images/nasilemak2.jpg", store: "Malay Corner Nasi Lemak" },
    { name: "Nasi Lemak with Egg", price: 4.00, img: "images/nasilemak3.jpg", store: "Malay Corner Nasi Lemak" },
    { name: "Nasi Lemak Special", price: 6.50, img: "images/nasilemak4.jpg", store: "Malay Corner Nasi Lemak" }
  ],
  traditional: [
    { name: "Kueh Lapis", price: 3.00, img: "images/chicken1.jpg", store: "Kopi & Teh Station" },
    { name: "Ondeh Ondeh", price: 2.50, img: "images/chicken2.jpg", store: "Kopi & Teh Station" },
    { name: "Ang Ku Kueh", price: 2.00, img: "images/chicken3.jpg", store: "Kopi & Teh Station" },
    { name: "Pulut Hitam", price: 3.50, img: "images/chicken4.jpg", store: "Kopi & Teh Station" }
  ],
  drinks: [
    { name: "Teh Tarik", price: 1.50, img: "images/drinks1.jpg", store: "Kopi & Teh Station" },
    { name: "Kopi O", price: 1.20, img: "images/drinks2.jpg", store: "Kopi & Teh Station" },
    { name: "Milo Dinosaur", price: 2.50, img: "images/drinks3.jpg", store: "Kopi & Teh Station" },
    { name: "Bandung", price: 2.00, img: "images/drinks4.jpg", store: "Kopi & Teh Station" }
  ]
};

// ===== LOAD SAVED MENU DATA =====
function loadMenuData() {
  const savedMenu = localStorage.getItem('hawkerMenu');
  if (savedMenu) {
    const parsed = JSON.parse(savedMenu);
    
    // Migrate old data - add store property if missing
    Object.keys(parsed).forEach(category => {
      parsed[category] = parsed[category].map(item => {
        if (!item.store) {
          // Assign default stores based on category
          if (category === 'chicken') item.store = "Uncle Tan's Chicken Rice";
          else if (category === 'curry') item.store = "Aunty Rose's Curry House";
          else if (category === 'thai') item.store = "Bangkok Street Thai";
          else if (category === 'nasi') item.store = "Malay Corner Nasi Lemak";
          else if (category === 'traditional' || category === 'drinks') item.store = "Kopi & Teh Station";
        }
        return item;
      });
    });
    
    foodByCategory = parsed;
    saveMenuData(); // Save the migrated data
  }
}

// ===== SAVE MENU DATA =====
function saveMenuData() {
  localStorage.setItem('hawkerMenu', JSON.stringify(foodByCategory));
}

// ===== RESET MENU DATA (for debugging) =====
function resetMenuData() {
  localStorage.removeItem('hawkerMenu');
  location.reload();
}

// Make it available globally for debugging
window.resetMenuData = resetMenuData;

// ===== SHOPPING CART =====
let cart = [];

// ===== HAWKER AUTH =====
let isHawkerLoggedIn = false;
const HAWKER_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// ===== CURRENT STORE =====
let currentStore = '';
let currentManagementStore = '';

// ===== SELECT STORE =====
function selectStore(storeName) {
  currentStore = storeName;
  document.getElementById('currentStoreName').textContent = storeName;
  loadAllFoodItems();
}

// ===== LOAD ALL FOOD ITEMS =====
function loadAllFoodItems() {
  const container = document.getElementById('foodCardsContainer');
  container.innerHTML = '';
  
  console.log('Current Store:', currentStore);
  
  if (!currentStore) {
    container.innerHTML = '<p class="text-center muted" style="grid-column: 1/-1; margin: 40px 0;">Please select a stall from the dropdown above.</p>';
    return;
  }
  
  let hasItems = false;
  
  // Load all categories but filter by current store
  Object.keys(foodByCategory).forEach(category => {
    const foods = foodByCategory[category] || [];
    console.log(`Category ${category}:`, foods.length, 'items');
    
    foods.forEach(food => {
      console.log(`  Item: ${food.name}, Store: ${food.store}, Match: ${food.store === currentStore}`);
      
      // Only show items from the selected store
      if (food.store === currentStore) {
        hasItems = true;
        const card = createFoodCard(food);
        container.appendChild(card);
      }
    });
  });
  
  console.log('Has items:', hasItems);
  
  if (!hasItems) {
    container.innerHTML = `<p class="text-center muted" style="grid-column: 1/-1; margin: 40px 0;">No items available for ${currentStore} yet.</p>`;
  }
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('show');
  });
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('show');
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  loadMenuData();
  showPage('menu'); // Start with menu page
  setupStoreDropdown();
  setupCartButton();
  setupCheckoutFlow();
  setupProfileButton();
  setupHawkerLogin();
  setupStoreManagement();
});

// ===== PROFILE BUTTON =====
function setupProfileButton() {
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showPage('profile');
    });
  }
}

// ===== STORE DROPDOWN SETUP =====
function setupStoreDropdown() {
  const stallSelect = document.getElementById('stallSelect');
  
  if (stallSelect) {
    stallSelect.addEventListener('change', function() {
      const selectedStore = this.value;
      if (selectedStore) {
        selectStore(selectedStore);
      }
    });
  }
}

// ===== HAWKER LOGIN SETUP =====
function setupHawkerLogin() {
  const hawkerLoginBtn = document.getElementById('hawkerLoginBtn');
  const hawkerLoginForm = document.getElementById('hawkerLoginForm');
  
  if (hawkerLoginBtn) {
    hawkerLoginBtn.addEventListener('click', function() {
      if (isHawkerLoggedIn) {
        showPage('storeManagement');
      } else {
        showPage('hawkerLogin');
      }
    });
  }
  
  if (hawkerLoginForm) {
    hawkerLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('hawkerUsername').value;
      const password = document.getElementById('hawkerPassword').value;
      
      if (username === HAWKER_CREDENTIALS.username && password === HAWKER_CREDENTIALS.password) {
        isHawkerLoggedIn = true;
        document.getElementById('loggedInUser').textContent = username;
        alert('Login successful! Welcome, ' + username + '.');
        showPage('storeManagement');
        hawkerLoginForm.reset();
      } else {
        alert('Invalid credentials. Please try again.');
      }
    });
  }
}

// ===== STORE MANAGEMENT SETUP =====
function setupStoreManagement() {
  const manageStoreSelect = document.getElementById('manageStoreSelect');
  const addItemForm = document.getElementById('addItemForm');
  const hawkerLogoutBtn = document.getElementById('hawkerLogoutBtn');
  
  // Handle store selection
  if (manageStoreSelect) {
    manageStoreSelect.addEventListener('change', function() {
      currentManagementStore = this.value;
      if (currentManagementStore) {
        loadCurrentMenu();
        document.getElementById('currentMenuSection').style.display = 'block';
      } else {
        document.getElementById('currentMenuSection').style.display = 'none';
      }
    });
  }
  
  // Handle add item form
  if (addItemForm) {
    addItemForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!currentManagementStore) {
        alert('Please select a store first!');
        return;
      }
      
      const category = document.getElementById('newItemCategory').value;
      const name = document.getElementById('newItemName').value;
      const price = parseFloat(document.getElementById('newItemPrice').value);
      const img = document.getElementById('newItemImage').value || 'images/default.jpg';
      
      const newItem = { 
        name, 
        price, 
        img,
        store: currentManagementStore  // Assign to current management store
      };
      
      if (!foodByCategory[category]) {
        foodByCategory[category] = [];
      }
      
      foodByCategory[category].push(newItem);
      saveMenuData();
      
      alert(`${name} added successfully to ${currentManagementStore}!`);
      addItemForm.reset();
      loadCurrentMenu();
      
      // Reload the menu if currently viewing this store
      if (currentStore === currentManagementStore) {
        loadAllFoodItems();
      }
    });
  }
  
  // Handle logout
  if (hawkerLogoutBtn) {
    hawkerLogoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        isHawkerLoggedIn = false;
        currentManagementStore = '';
        alert('Logged out successfully.');
        showPage('menu');
      }
    });
  }
}

// ===== LOAD CURRENT MENU =====
function loadCurrentMenu() {
  const menuItemsContainer = document.getElementById('currentMenuItems');
  if (!menuItemsContainer) return;
  
  menuItemsContainer.innerHTML = '';
  
  if (!currentManagementStore) {
    menuItemsContainer.innerHTML = '<p class="muted" style="text-align:center; padding:20px;">Please select a store to manage.</p>';
    return;
  }
  
  let totalItems = 0;
  
  Object.keys(foodByCategory).forEach(category => {
    foodByCategory[category].forEach((item, index) => {
      // Only show items from the selected management store
      if (item.store === currentManagementStore) {
        totalItems++;
        const card = createMenuItemCard(item, category, index);
        menuItemsContainer.appendChild(card);
      }
    });
  });
  
  if (totalItems === 0) {
    menuItemsContainer.innerHTML = `<p class="muted" style="text-align:center; padding:20px;">No menu items yet for ${currentManagementStore}. Add your first item below!</p>`;
  }
}

// ===== CREATE MENU ITEM CARD =====
function createMenuItemCard(item, category, index) {
  const card = document.createElement('div');
  card.className = 'menu-item-card';
  
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}" class="menu-item-img" onerror="this.style.display='none'">
    <div class="menu-item-info">
      <h4>${item.name}</h4>
      <p class="item-price">$${item.price.toFixed(2)}</p>
      <p class="muted">Category: ${category}</p>
      <p class="muted">Store: ${item.store || 'Not assigned'}</p>
    </div>
    <button class="btn-delete-item" onclick="deleteMenuItem('${category}', ${index})">
      Delete
    </button>
  `;
  
  return card;
}

// ===== DELETE MENU ITEM =====
function deleteMenuItem(category, index) {
  if (confirm('Are you sure you want to delete this item?')) {
    const deletedItem = foodByCategory[category][index];
    foodByCategory[category].splice(index, 1);
    saveMenuData();
    loadCurrentMenu();
    
    // Reload the menu if currently viewing the same store as the deleted item
    if (currentStore === deletedItem.store) {
      loadAllFoodItems();
    }
    
    alert('Item deleted successfully!');
  }
}

// ===== CUISINE TABS =====
function setupCuisineTabs() {
  const tabs = document.querySelectorAll('.cuisine-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      loadFoodCategory(category);
    });
  });
}

// ===== LOAD FOOD BY CATEGORY =====
function loadFoodCategory(category) {
  const container = document.getElementById('foodCardsContainer');
  container.innerHTML = '';
  
  const foods = foodByCategory[category] || [];
  
  if (foods.length === 0) {
    container.innerHTML = '<p class="text-center muted" style="grid-column: 1/-1; margin: 40px 0;">No items in this category yet.</p>';
    return;
  }
  
  foods.forEach(food => {
    const card = createFoodCard(food);
    container.appendChild(card);
  });
}

// ===== CREATE FOOD CARD =====
function createFoodCard(food) {
  const card = document.createElement('div');
  card.className = 'food-card';
  
  card.innerHTML = `
    <div class="food-image">
      <img src="${food.img}" alt="${food.name}" onerror="this.style.display='none'">
    </div>
    <div class="food-name">${food.name}</div>
    <div class="food-price">$${food.price.toFixed(2)}</div>
    <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(food)})'>
      Add to Cart
    </button>
  `;
  
  return card;
}

// ===== ADD TO CART =====
function addToCart(food) {
  const existingItem = cart.find(item => item.name === food.name);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      name: food.name,
      price: food.price,
      qty: 1
    });
  }
  
  alert(`${food.name} added to cart!`);
}

// ===== CART BUTTON =====
function setupCartButton() {
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', function() {
      updateCartDisplay();
      showPage('cart');
    });
  }
}

// ===== UPDATE CART DISPLAY =====
function updateCartDisplay() {
  const cartList = document.getElementById('cartList');
  const totalElement = document.getElementById('total');
  
  if (!cartList) return;
  
  cartList.innerHTML = '';
  
  if (cart.length === 0) {
    cartList.innerHTML = '<p class="text-center muted">Your cart is empty</p>';
    if (totalElement) totalElement.textContent = '$0.00';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div>${item.name}</div>
      <div style="text-align: center;">${item.qty}</div>
      <div style="text-align: right;">$${itemTotal.toFixed(2)}</div>
    `;
    cartList.appendChild(row);
  });
  
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

// ===== CHECKOUT FLOW =====
function setupCheckoutFlow() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      showPage('paymethod');
    });
  }
  
  const cardBtn = document.getElementById('cardBtn');
  if (cardBtn) {
    cardBtn.addEventListener('click', function() {
      showPage('payment');
    });
  }
  
  const payForm = document.getElementById('payForm');
  if (payForm) {
    payForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const orderNum = '#' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('orderNo').textContent = orderNum;
      
      saveOrderToHistory(orderNum, cart);
      cart = [];
      updateCartDisplay();
      
      showPage('thankyou');
      payForm.reset();
    });
  }
}

// ===== ORDER HISTORY =====
function saveOrderToHistory(orderNumber, items) {
  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  
  const order = {
    orderNumber: orderNumber,
    date: new Date().toISOString(),
    items: [...items],
    total: items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  };
  
  orders.unshift(order);
  localStorage.setItem('orderHistory', JSON.stringify(orders));
}

function loadOrderHistory() {
  const orderList = document.getElementById('orderList');
  if (!orderList) return;
  
  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  
  if (orders.length === 0) {
    orderList.innerHTML = '<p class="text-center muted">No orders yet</p>';
    return;
  }
  
  orderList.innerHTML = '';
  
  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    const dateObj = new Date(order.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    let itemsHTML = '';
    order.items.forEach(item => {
      itemsHTML += `
        <div class="order-item">
          <div>${item.name}</div>
          <div style="text-align: center;">${item.qty}</div>
          <div style="text-align: right;">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
      `;
    });
    
    orderCard.innerHTML = `
      <div class="order-header">
        <h3>${order.orderNumber}</h3>
        <span class="order-date">${formattedDate}</span>
      </div>
      <div class="order-items">
        ${itemsHTML}
      </div>
      <div class="order-total">
        <strong>Total: $${order.total.toFixed(2)}</strong>
      </div>
    `;
    
    orderList.appendChild(orderCard);
  });
}

function clearOrders() {
  if (confirm('Clear all order history?')) {
    localStorage.removeItem('orderHistory');
    loadOrderHistory();
  }
}

// ===== NAVIGATION HANDLERS =====
const navStall = document.getElementById('navStall');
if (navStall) {
  navStall.addEventListener('click', function(e) {
    e.preventDefault();
    showPage('menu');
  });
}

const ordersBtn = document.getElementById('navOrders');
if (ordersBtn) {
  ordersBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loadOrderHistory();
    showPage('orders');
  });
}