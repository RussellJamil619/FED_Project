// =========================
// app.js (UPDATED with localStorage for Orders & Menu)
// ✅ Store order history
// ✅ Store menu (can be updated)
// ✅ View past orders
// =========================
const pages = document.querySelectorAll(".page");

// Default menu data (used if nothing in localStorage)
const DEFAULT_MENU = {
  "Uncle Tan's Chicken Rice": [
    { name:"Hainanese Chicken Rice", price: 5.00, img:"images/chicken1.jpg" },
    { name:"Roasted Chicken Rice", price: 5.50, img:"images/chicken2.jpg" },
    { name:"Chicken Soup", price: 3.00, img:"images/chicken3.jpg" },
    { name:"Chicken Noodles", price: 4.50, img:"images/chicken4.jpg" }
  ],
  "Aunty Rose's Curry House": [
    { name:"Curry Chicken", price: 5.00, img:"images/curry1.jpg" },
    { name:"Fish Curry", price: 5.50, img:"images/curry2.jpg" },
    { name:"Vegetable Curry", price: 4.00, img:"images/curry3.jpg" },
    { name:"Curry Noodles", price: 4.50, img:"images/curry4.jpg" }
  ],
  "Bangkok Street Thai": [
    { name:"Pad Thai", price: 6.00, img:"images/thai1.jpg" },
    { name:"Tom Yum Soup", price: 5.50, img:"images/thai2.jpg" },
    { name:"Basil Chicken Rice", price: 6.50, img:"images/thai3.jpg" },
    { name:"Mango Sticky Rice", price: 3.00, img:"images/thai4.jpg" }
  ],
  "Malay Corner Nasi Lemak": [
    { name:"Nasi Lemak Set", price: 5.00, img:"images/nasilemak1.jpg" },
    { name:"Nasi Lemak with Chicken", price: 6.00, img:"images/nasilemak2.jpg" },
    { name:"Nasi Lemak with Fish", price: 6.50, img:"images/nasilemak3.jpg" },
    { name:"Nasi Lemak Special", price: 7.50, img:"images/nasilemak4.jpg" }
  ],
  "Kopi & Teh Station": [
    { name:"Kopi O", price: 1.50, img:"images/drinks1.jpg" },
    { name:"Teh Tarik", price: 2.00, img:"images/drinks2.jpg" },
    { name:"Milo Dinosaur", price: 2.50, img:"images/drinks3.jpg" },
    { name:"Fresh Orange Juice", price: 3.00, img:"images/drinks4.jpg" }
  ]
};

// localStorage keys
const CART_KEY = "hawker_cart_v4";
const MENU_KEY = "hawker_menu_v1";
const ORDERS_KEY = "hawker_orders_v1";

// Load data from localStorage
let cart = loadCart();
let MENU = loadMenu();
let orderHistory = loadOrders();
let selectedStall = "";

// ===== LOAD FUNCTIONS =====
function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{
    return [];
  }
}

function loadMenu(){
  try{
    const raw = localStorage.getItem(MENU_KEY);
    if (raw) {
      return JSON.parse(raw);
    } else {
      // First time - save default menu to localStorage
      saveMenu(DEFAULT_MENU);
      return DEFAULT_MENU;
    }
  }catch{
    return DEFAULT_MENU;
  }
}

function loadOrders(){
  try{
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{
    return [];
  }
}

// ===== SAVE FUNCTIONS =====
function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function saveMenu(menuData){
  localStorage.setItem(MENU_KEY, JSON.stringify(menuData));
}

function saveOrders(){
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orderHistory));
}

// ===== UTILITY FUNCTIONS =====
function showPage(id){
  pages.forEach(p => p.classList.remove("show"));
  document.getElementById(id).classList.add("show");
  
  if (id === "cart") {
    renderCart();
  } else if (id === "orders") {
    renderOrders();
  }
}

function updateCartCount(){
  let count = 0;
  for (let i = 0; i < cart.length; i++){
    count += cart[i].qty;
  }
  document.getElementById("cartCount").textContent = String(count);
}

function calcTotal(){
  let sum = 0;
  for (let i = 0; i < cart.length; i++){
    sum += cart[i].price * cart[i].qty;
  }
  return sum;
}

function generateOrderNumber(){
  return Math.floor(1000 + Math.random() * 9000);
}

function getCurrentDateTime(){
  const now = new Date();
  const date = now.toLocaleDateString('en-SG');
  const time = now.toLocaleTimeString('en-SG');
  return { date, time };
}

// ===== NAVIGATION =====
// Only Stall navigation is active
document.getElementById("navStall").addEventListener("click", function(e){
  e.preventDefault();
  updateActiveNav(this);
  showPage("menu");
});

// Disabled navigation items (do nothing)
const disabledNavs = ["navHome", "navOrders", "navFeedback", "navHygiene", "navAnalytics"];
disabledNavs.forEach(navId => {
  const navElement = document.getElementById(navId);
  if (navElement) {
    navElement.addEventListener("click", function(e){
      e.preventDefault();
      // Do nothing - button is disabled
    });
  }
});

// Update active nav link styling
function updateActiveNav(activeLink) {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active-tag");
  });
  activeLink.classList.add("active-tag");
}

// Profile icon click handler
document.getElementById("profileIcon").addEventListener("click", function(e){
  e.preventDefault();
  
  // Check if user is logged in
  const loggedInUser = localStorage.getItem("loggedInUser");
  
  if (loggedInUser) {
    // User is logged in, go to store management
    showPage("storeManagement");
    document.getElementById("loggedInUser").textContent = loggedInUser;
  } else {
    // User not logged in, show login page
    showPage("login");
  }
});

document.getElementById("floatCartBtn").addEventListener("click", function(){
  showPage("cart");
});

document.getElementById("checkoutBtn").addEventListener("click", function(){
  if (cart.length === 0){
    alert("Cart is empty!");
    return;
  }
  showPage("paymethod");
});

document.getElementById("cardBtn").addEventListener("click", function(){
  showPage("payment");
});

document.querySelectorAll(".payBtn").forEach(btn => {
  btn.addEventListener("click", function(){
    showPage("payment");
  });
});

// ===== PAYMENT & ORDER =====
document.getElementById("payForm").addEventListener("submit", function(e){
  e.preventDefault();

  const orderNumber = generateOrderNumber();
  const dateTime = getCurrentDateTime();
  
  // Create order object
  const order = {
    orderNumber: orderNumber,
    date: dateTime.date,
    time: dateTime.time,
    items: [...cart], // Copy cart items
    total: calcTotal()
  };
  
  // Add to order history
  orderHistory.push(order);
  saveOrders();
  
  // Display order number
  document.getElementById("orderNo").textContent = "#" + orderNumber;

  // Clear cart
  cart = [];
  saveCart();
  updateCartCount();
  document.getElementById("total").textContent = "$0.00";

  showPage("thankyou");
});

// ===== STALL DROPDOWN =====
const stallSelect = document.getElementById("stallSelect");
const stallTitle = document.getElementById("stallTitle");
const foodGrid = document.getElementById("foodGrid");

stallSelect.addEventListener("change", function(){
  selectedStall = this.value;
  
  if (selectedStall === "") {
    stallTitle.textContent = "Please select a stall";
    foodGrid.innerHTML = "";
  } else {
    stallTitle.textContent = selectedStall;
    renderMenu(selectedStall);
  }
});

// ===== RENDER MENU =====
function renderMenu(stallName){
  foodGrid.innerHTML = "";
  
  if (!MENU[stallName]) {
    foodGrid.innerHTML = '<p class="muted">No items available.</p>';
    return;
  }
  
  const items = MENU[stallName];

  for (let i = 0; i < items.length; i++){
    const card = document.createElement("div");
    card.className = "food";

    card.innerHTML = `
      <div class="foodimg">
        <img src="${items[i].img}" alt="${items[i].name}">
      </div>
      <p class="foodname">${items[i].name}</p>
      <p class="foodprice">$${items[i].price.toFixed(2)}</p>
      <button class="addBtn">Add to cart</button>
    `;

    card.querySelector(".addBtn").addEventListener("click", function(){
      addToCart(items[i]);
    });

    foodGrid.appendChild(card);
  }
}

// ===== ADD TO CART =====
function addToCart(item){
  const existing = cart.find(x => x.name === item.name);
  if (existing){
    existing.qty += 1;
  }else{
    cart.push({ name: item.name, price: item.price, qty: 1 });
  }
  saveCart();
  updateCartCount();
  
  // Visual feedback
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = "Added! ✓";
  btn.style.background = "#4CAF50";
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = "";
  }, 800);
}

// ===== RENDER CART =====
function renderCart(){
  const list = document.getElementById("cartList");
  list.innerHTML = "";

  if (cart.length === 0){
    list.innerHTML = `<div class="muted">No items in cart.</div>`;
    document.getElementById("total").textContent = "$0.00";
    return;
  }

  for (let i = 0; i < cart.length; i++){
    const row = document.createElement("div");
    row.className = "cartrow";
    row.innerHTML = `
      <div>${cart[i].name}</div>
      <div class="right">${cart[i].qty}</div>
      <div class="right">$${(cart[i].price * cart[i].qty).toFixed(2)}</div>
    `;
    list.appendChild(row);
  }

  document.getElementById("total").textContent = "$" + calcTotal().toFixed(2);
}

// ===== RENDER ORDER HISTORY =====
function renderOrders(){
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  if (orderHistory.length === 0){
    orderList.innerHTML = `<div class="muted">No orders yet.</div>`;
    return;
  }

  // Show most recent first
  for (let i = orderHistory.length - 1; i >= 0; i--){
    const order = orderHistory[i];
    
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";
    
    let itemsHTML = "";
    for (let j = 0; j < order.items.length; j++){
      itemsHTML += `
        <div class="order-item">
          <span>${order.items[j].name}</span>
          <span>x${order.items[j].qty}</span>
          <span>$${(order.items[j].price * order.items[j].qty).toFixed(2)}</span>
        </div>
      `;
    }
    
    orderCard.innerHTML = `
      <div class="order-header">
        <h3>Order #${order.orderNumber}</h3>
        <div class="order-date">${order.date} at ${order.time}</div>
      </div>
      <div class="order-items">
        ${itemsHTML}
      </div>
      <div class="order-total">
        <strong>Total: $${order.total.toFixed(2)}</strong>
      </div>
    `;
    
    orderList.appendChild(orderCard);
  }
}

// ===== CLEAR DATA FUNCTIONS (for testing/development) =====
function clearAllData(){
  if (confirm("Are you sure you want to clear ALL data (cart, orders, menu)?")){
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(MENU_KEY);
    location.reload();
  }
}

function clearOrders(){
  if (confirm("Are you sure you want to clear order history?")){
    orderHistory = [];
    saveOrders();
    renderOrders();
    alert("Order history cleared!");
  }
}

// Make functions available in console for testing
window.clearAllData = clearAllData;
window.clearOrders = clearOrders;

// ===== LOGIN & STORE MANAGEMENT =====
// Login form handler
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  
  // Simple authentication (you can make this more secure)
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("loggedInUser", username);
    document.getElementById("loggedInUser").textContent = username;
    showPage("storeManagement");
    
    // Clear form
    document.getElementById("loginForm").reset();
  } else {
    alert("Invalid username or password!");
  }
});

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("loggedInUser");
    showPage("menu"); // Go to stall page instead of home
    document.getElementById("navStall").click(); // Activate stall nav
    alert("Logged out successfully!");
  }
}

// Store selection handler
let selectedStoreForManagement = "";

document.getElementById("manageStoreSelect").addEventListener("change", function(){
  selectedStoreForManagement = this.value;
  
  if (selectedStoreForManagement) {
    document.getElementById("currentMenuSection").style.display = "block";
    renderCurrentMenuItems();
  } else {
    document.getElementById("currentMenuSection").style.display = "none";
  }
});

// Render current menu items for selected store
function renderCurrentMenuItems() {
  const container = document.getElementById("currentMenuItems");
  container.innerHTML = "";
  
  if (!MENU[selectedStoreForManagement]) {
    container.innerHTML = '<p class="muted">No items found.</p>';
    return;
  }
  
  const items = MENU[selectedStoreForManagement];
  
  for (let i = 0; i < items.length; i++) {
    const itemCard = document.createElement("div");
    itemCard.className = "menu-item-card";
    itemCard.innerHTML = `
      <img src="${items[i].img}" alt="${items[i].name}" class="menu-item-img">
      <div class="menu-item-info">
        <h4>${items[i].name}</h4>
        <p class="item-price">$${items[i].price.toFixed(2)}</p>
      </div>
      <button class="btn-delete-item" onclick="deleteMenuItem(${i})">Delete</button>
    `;
    container.appendChild(itemCard);
  }
}

// Add new menu item
document.getElementById("addItemForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  if (!selectedStoreForManagement) {
    alert("Please select a store first!");
    return;
  }
  
  const name = document.getElementById("newItemName").value;
  const price = parseFloat(document.getElementById("newItemPrice").value);
  const image = document.getElementById("newItemImage").value.trim();
  
  // Use placeholder image if no image provided
  let imagePath;
  if (image) {
    imagePath = "images/" + image;
  } else {
    // Use a placeholder or default image
    imagePath = "https://via.placeholder.com/200x200/f2c100/ffffff?text=No+Image";
  }
  
  // Add to menu
  const newItem = {
    name: name,
    price: price,
    img: imagePath
  };
  
  MENU[selectedStoreForManagement].push(newItem);
  saveMenu(MENU);
  
  // Clear form
  document.getElementById("addItemForm").reset();
  
  // Refresh display
  renderCurrentMenuItems();
  
  alert(`"${name}" has been added to ${selectedStoreForManagement}!`);
});

// Delete menu item
function deleteMenuItem(index) {
  if (!selectedStoreForManagement) return;
  
  const item = MENU[selectedStoreForManagement][index];
  
  if (confirm(`Delete "${item.name}"?`)) {
    MENU[selectedStoreForManagement].splice(index, 1);
    saveMenu(MENU);
    renderCurrentMenuItems();
    alert("Item deleted successfully!");
  }
}

// Make functions available globally
window.logout = logout;
window.deleteMenuItem = deleteMenuItem;

// ===== INITIALIZE =====
updateCartCount();






