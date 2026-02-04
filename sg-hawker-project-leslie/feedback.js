let reviews = [];
let selectedRating = 0;

// Load reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    setupStarRating();
    setupFormSubmission();
    setupTabs();
    setupSortingFilter();
});

// ===== STAR RATING FUNCTIONALITY =====
function setupStarRating() {
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
        // Click event
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = selectedRating;
            updateStars(selectedRating);
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            updateStars(hoverRating);
        });
    });
    
    // Reset to selected rating on mouse leave
    document.getElementById('starRating').addEventListener('mouseleave', function() {
        updateStars(selectedRating);
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

// ===== FORM SUBMISSION =====
function setupFormSubmission() {
    const form = document.getElementById('feedbackForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const stallSelect = document.getElementById('stallSelect');
        const feedbackText = document.getElementById('feedbackText');
        const ratingValue = document.getElementById('ratingValue');
        
        // Validate rating
        if (!ratingValue.value || selectedRating === 0) {
            alert('Please select a rating!');
            return;
        }
        
        // Create new review object
        const newReview = {
            id: reviews.length + 1,
            stallName: stallSelect.value,
            author: 'You',
            rating: parseInt(ratingValue.value),
            text: feedbackText.value,
            date: new Date().toISOString().split('T')[0],
            isTopReview: parseInt(ratingValue.value) === 5
        };
        
        // Add to reviews array at the beginning
        reviews.unshift(newReview);
        
        // Show success message
        showSuccessMessage();
        
        // Clear form
        clearForm();
        
        // Reload reviews
        displayReviews(reviews);
        
        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function clearForm() {
    document.getElementById('feedbackForm').reset();
    selectedRating = 0;
    updateStars(0);
    document.getElementById('ratingValue').value = '';
}

function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// ===== LOAD REVIEWS FROM JSON =====
async function loadReviews() {
    try {
        const response = await fetch('reviews.json');
        reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error loading reviews:', error);
        // Fallback to default reviews if JSON fails
        reviews = getDefaultReviews();
        displayReviews(reviews);
    }
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

// ===== DISPLAY REVIEWS =====
function displayReviews(reviewsToDisplay) {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '';
    
    // Show only first 4 reviews
    const reviewsToShow = reviewsToDisplay.slice(0, 4);
    
    reviewsToShow.forEach(review => {
        const reviewCard = createReviewCard(review);
        container.appendChild(reviewCard);
    });
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = review.isTopReview ? 'review-card top-review' : 'review-card';
    
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

// ===== SORTING FUNCTIONALITY =====
function setupSortingFilter() {
    const sortSelect = document.getElementById('sortSelect');
    
    sortSelect.addEventListener('change', function() {
        const sortType = this.value;
        let sortedReviews = [...reviews];
        
        switch(sortType) {
            case 'highest':
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'newest':
            default:
                sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
        
        displayReviews(sortedReviews);
    });
}

// ===== TAB SWITCHING =====
function setupTabs() {
    const feedbackTab = document.getElementById('feedbackTab');
    const complaintTab = document.getElementById('complaintTab');
    const feedbackContent = document.getElementById('feedbackContent');
    const complaintContent = document.getElementById('complaintContent');
    
    feedbackTab.addEventListener('click', function() {
        feedbackTab.classList.add('active');
        complaintTab.classList.remove('active');
        feedbackContent.style.display = 'flex';
        complaintContent.style.display = 'none';
    });
    
    complaintTab.addEventListener('click', function() {
        complaintTab.classList.add('active');
        feedbackTab.classList.remove('active');
        complaintContent.style.display = 'block';
        feedbackContent.style.display = 'none';
    });
}