// ===== ALL REVIEWS PAGE JAVASCRIPT WITH LOCALSTORAGE =====

let allReviews = [];

// Load reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAllReviews();
    setupFilters();
});

// ===== LOAD ALL REVIEWS FROM LOCALSTORAGE =====
function loadAllReviews() {
    // Load from localStorage
    const storedReviews = localStorage.getItem('hawkerReviews');
    
    if (storedReviews) {
        allReviews = JSON.parse(storedReviews);
    } else {
        // Fallback to default reviews
        allReviews = getDefaultReviews();
    }
    
    displayAllReviews(allReviews);
}

function getDefaultReviews() {
    return [
        {
            id: 1,
            stallName: "Char Kway Teow House",
            author: "Leslie T.",
            rating: 5,
            text: "Amazing wok hei! This is the real deal. The flavors are perfectly balanced and the prawns are fresh.",
            date: "2026-02-03",
            isTopReview: true
        },
        {
            id: 2,
            stallName: "Laksa Paradise",
            author: "Yifei W.",
            rating: 5,
            text: "Authentic laksa with rich coconut broth. Highly recommend! The spice level is just right.",
            date: "2026-02-02",
            isTopReview: true
        },
        {
            id: 3,
            stallName: "Roti Prata Corner",
            author: "Arri K.",
            rating: 4,
            text: "Crispy prata with excellent curry. Service could be faster, but the food makes up for it.",
            date: "2026-02-01",
            isTopReview: false
        },
        {
            id: 4,
            stallName: "Ah Meng's Chicken Rice",
            author: "Russell M.",
            rating: 5,
            text: "Best chicken rice in Singapore! The rice is so fragrant and the chicken is tender. A must-try!",
            date: "2026-01-31",
            isTopReview: true
        }
    ];
}

// ===== DISPLAY ALL REVIEWS =====
function displayAllReviews(reviewsToDisplay) {
    const container = document.getElementById('allReviewsContainer');
    const noResults = document.getElementById('noResults');
    
    container.innerHTML = '';
    
    if (reviewsToDisplay.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    reviewsToDisplay.forEach(review => {
        const reviewCard = createReviewCard(review);
        container.appendChild(reviewCard);
    });
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = review.isTopReview ? 'review-card top-review mb-3' : 'review-card mb-3';
    
    const stars = generateStars(review.rating);
    const topBadge = review.isTopReview ? '<div class="top-badge"><i class="fas fa-trophy"></i> Top Review</div>' : '';
    
    card.innerHTML = `
        ${topBadge}
        <div class="review-header">
            <div>
                <div class="review-stall-name">${review.stallName}</div>
                <div class="review-author">${review.author} • ${formatDate(review.date)}</div>
            </div>
            <div class="review-stars">
                ${stars}
            </div>
        </div>
        <div class="review-text">${review.text}</div>
    `;
    
    return card;
}

function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// ===== FILTERS =====
function setupFilters() {
    const sortSelect = document.getElementById('sortSelectAll');
    const filterStall = document.getElementById('filterStall');
    
    // Sort filter
    sortSelect.addEventListener('change', applyFilters);
    
    // Stall filter
    filterStall.addEventListener('change', applyFilters);
}

function applyFilters() {
    const sortType = document.getElementById('sortSelectAll').value;
    const stallFilter = document.getElementById('filterStall').value;
    
    let filteredReviews = [...allReviews];
    
    // Filter by stall
    if (stallFilter !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.stallName === stallFilter);
    }
    
    // Sort
    switch(sortType) {
        case 'highest':
            filteredReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            filteredReviews.sort((a, b) => a.rating - b.rating);
            break;
        case 'newest':
        default:
            filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }
    
    displayAllReviews(filteredReviews);
}