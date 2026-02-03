// =========================
// app.js (FULL)
// =========================
const pages = document.querySelectorAll(".page");

const MENU = {
  "Chicken Rice": [
    { name:"Chicken Rice", price: 5.00, img:"images/chicken1.jpg" },
    { name:"Roasted Chicken", price: 5.00, img:"images/chicken2.jpg" },
    { name:"Chicken Soup", price: 6.00, img:"images/chicken3.jpg" },
    { name:"Chicken Noodles", price: 2.00, img:"images/chicken4.jpg" }
  ],
  "Curry": [
    { name:"Curry Chicken", price: 5.00, img:"images/curry1.jpg" },
    { name:"Fish Curry", price: 5.50, img:"images/curry2.jpg" },
    { name:"Curry Veg", price: 6.00, img:"images/curry3.jpg" },
    { name:"Curry Noodles", price: 4.50, img:"images/curry4.jpg" }
  ],
  "Thai Food": [
    { name:"Pad Thai", price: 5.00, img:"images/thai1.jpg" },
    { name:"Tom Yum Soup", price: 5.00, img:"images/thai2.jpg" },
    { name:"Basil Chicken", price: 6.00, img:"images/thai3.jpg" },
    { name:"Thai Dessert", price: 2.00, img:"images/thai4.jpg" }
  ],
  "Nasi Lemak": [
    { name:"Nasi Lemak Set", price: 5.00, img:"images/nasilemak1.jpg" },
    { name:"Nasi Lemak Chicken", price: 6.00, img:"images/nasilemak2.jpg" },
    { name:"Nasi Lemak Fish", price: 6.50, img:"images/nasilemak3.jpg" },
    { name:"Nasi Lemak Special", price: 7.00, img:"images/nasilemak4.jpg" }
  ],
  "Drinks": [
    { name:"Kopi", price: 2.00, img:"images/drinks1.jpg" },
    { name:"Teh", price: 2.00, img:"images/drinks2.jpg" },
    { name:"Milo", price: 2.50, img:"images/drinks3.jpg" },
    { name:"Orange Juice", price: 3.50, img:"images/drinks4.jpg" }
  ]
};

const CART_KEY = "hawker_cart_v4";
let cart = loadCart();
let activeCuisine = Object.keys(MENU)[0];

function showPage(id){
  pages.forEach(p => p.classList.remove("show"));
  document.getElementById(id).classList.add("show");
  if (id === "cart") renderCart();
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

/* nav / buttons */
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

document.querySelectorAll(".paychip").forEach(btn => {
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

/* Tabs + Menu */
const tabs = document.getElementById("tabs");
const grid = document.getElementById("foodGrid");

function buildTabs(){
  tabs.innerHTML = "";
  const cuisines = Object.keys(MENU);

  for (let i = 0; i < cuisines.length; i++){
    const btn = document.createElement("button");
    btn.className = "tab" + (cuisines[i] === activeCuisine ? " active" : "");
    btn.textContent = cuisines[i];

    btn.addEventListener("click", function(){
      activeCuisine = cuisines[i];
      buildTabs();
      renderMenu(activeCuisine);
    });

    tabs.appendChild(btn);
  }
}

function renderMenu(cuisine){
  grid.innerHTML = "";
  const items = MENU[cuisine];

  for (let i = 0; i < items.length; i++){
    const card = document.createElement("div");
    card.className = "foodcard";

    card.innerHTML = `
      <div class="foodimg">
        <img src="${items[i].img}" alt="${items[i].name}">
      </div>
      <div class="pricepill">$${items[i].price.toFixed(2)}</div>
      <button class="addbtn">Add to cart</button>
    `;

    card.querySelector(".addbtn").addEventListener("click", function(){
      addToCart(items[i]);
    });

    grid.appendChild(card);
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

/* init */
buildTabs();
renderMenu(activeCuisine);
updateCartCount();






