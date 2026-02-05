// =========================
// app.js (UPDATED)
// ✅ New stall names matching dropdown
// ✅ Dropdown functionality implemented
// =========================
const pages = document.querySelectorAll(".page");

// Menu data organized by stall name
const MENU = {
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

const CART_KEY = "hawker_cart_v4";
let cart = loadCart();
let selectedStall = "";

function showPage(id){
  pages.forEach(p => p.classList.remove("show"));
  document.getElementById(id).classList.add("show");
  
  // Update nav links
  document.querySelectorAll(".navlink").forEach(link => {
    link.classList.remove("is-active");
  });
  
  if (id === "home") {
    document.getElementById("navHome").classList.add("is-active");
  } else if (id === "menu") {
    document.getElementById("navStall").classList.add("is-active");
  } else if (id === "cart") {
    renderCart();
  }
}

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{
    return [];
  }
}

function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
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

/* Navigation buttons */
document.getElementById("navHome").addEventListener("click", function(){
  showPage("home");
});

document.getElementById("navStall").addEventListener("click", function(){
  showPage("menu");
});

document.getElementById("navOrders").addEventListener("click", function(){
  alert("Orders page - Coming soon!");
});

document.getElementById("homeShopBtn").addEventListener("click", function(){
  showPage("menu");
});

document.getElementById("topCartBtn").addEventListener("click", function(){
  showPage("cart");
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

document.getElementById("payForm").addEventListener("submit", function(e){
  e.preventDefault();

  const order = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("orderNo").textContent = "#" + order;

  cart = [];
  saveCart();
  updateCartCount();
  document.getElementById("total").textContent = "$0.00";

  showPage("thankyou");
});

/* Stall Dropdown */
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

/* Cart */
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

/* Initialize */
updateCartCount();






