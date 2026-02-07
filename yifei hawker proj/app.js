// ===== FOOD DATA BY CATEGORY =====
const foodByCategory = {
  chicken: [
    { name: "Hainanese Chicken Rice", price: 5.00, img: "images/chicken1.jpg" },
    { name: "Roasted Chicken Rice", price: 5.00, img: "images/chicken2.jpg" },
    { name: "Steamed Chicken Rice", price: 6.00, img: "images/chicken3.jpg" },
    { name: "Chicken Porridge", price: 2.00, img: "images/chicken4.jpg" }
  ],
  curry: [
    { name: "Chicken Curry", price: 6.50, img: "images/curry1.jpg" },
    { name: "Fish Curry", price: 7.00, img: "images/curry2.jpg" },
    { name: "Mutton Curry", price: 7.50, img: "images/curry3.jpg" },
    { name: "Vegetable Curry", price: 5.50, img: "images/curry4.jpg" }
  ],
  thai: [
    { name: "Pad Thai", price: 6.00, img: "images/thai1.jpg" },
    { name: "Tom Yum Soup", price: 5.50, img: "images/thai2.jpg" },
    { name: "Green Curry", price: 7.00, img: "images/thai3.jpg" },
    { name: "Mango Sticky Rice", price: 4.50, img: "images/thai4.jpg" }
  ],
  nasi: [
    { name: "Nasi Lemak with Chicken", price: 5.00, img: "images/nasilemak1.jpg" },
    { name: "Nasi Lemak with Fish", price: 5.50, img: "images/nasilemak2.jpg" },
    { name: "Nasi Lemak with Egg", price: 4.00, img: "images/nasilemak3.jpg" },
    { name: "Nasi Lemak Special", price: 6.50, img: "images/nasilemak4.jpg" }
  ],
  traditional: [
    { name: "Kueh Lapis", price: 3.00, img: "images/chicken1.jpg" },
    { name: "Ondeh Ondeh", price: 2.50, img: "images/chicken2.jpg" },
    { name: "Ang Ku Kueh", price: 2.00, img: "images/chicken3.jpg" },
    { name: "Pulut Hitam", price: 3.50, img: "images/chicken4.jpg" }
  ],
  drinks: [
    { name: "Teh Tarik", price: 1.50, img: "images/drinks1.jpg" },
    { name: "Kopi O", price: 1.20, img: "images/drinks2.jpg" },
    { name: "Milo Dinosaur", price: 2.50, img: "images/drinks3.jpg" },
    { name: "Bandung", price: 2.00, img: "images/drinks4.jpg" }
  ]
};

// ===== SHOPPING CART =====
let cart = [];

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
  showPage('menu');
  loadFoodCategory('chicken'); // Load chicken rice by default
  setupCuisineTabs();
  setupCartButton();
  setupCheckoutFlow();
});

// ===== CUISINE TABS =====
function setupCuisineTabs() {
  const tabs = document.querySelectorAll('.cuisine-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active to clicked tab
      this.classList.add('active');
      
      // Load food for this category
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

// Orders button click
const ordersBtn = document.getElementById('navOrders');
if (ordersBtn) {
  ordersBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loadOrderHistory();
    showPage('orders');
  });
}