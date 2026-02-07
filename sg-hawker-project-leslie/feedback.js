// ===== FEEDBACK PAGE JAVASCRIPT WITH LOCALSTORAGE =====

let reviews = [];
let complaints = [];
let selectedRating = 0;

// Load reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    loadComplaints();
    setupStarRating();
    setupFormSubmission();
    setupComplaintSubmission();
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
            id: Date.now(), // Use timestamp as unique ID
            stallName: stallSelect.value,
            author: 'You',
            rating: parseInt(ratingValue.value),
            text: feedbackText.value,
            date: new Date().toISOString().split('T')[0],
            isTopReview: parseInt(ratingValue.value) === 5
        };
        
        // Add to reviews array at the beginning
        reviews.unshift(newReview);
        
        // Save to localStorage
        saveReviewsToLocalStorage();
        
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

// ===== LOCALSTORAGE FUNCTIONS FOR REVIEWS =====
function saveReviewsToLocalStorage() {
    localStorage.setItem('hawkerReviews', JSON.stringify(reviews));
}

function loadReviewsFromLocalStorage() {
    const storedReviews = localStorage.getItem('hawkerReviews');
    if (storedReviews) {
        return JSON.parse(storedReviews);
    }
    return null;
}

// ===== LOAD REVIEWS =====
async function loadReviews() {
    // First, try to load from localStorage
    const storedReviews = loadReviewsFromLocalStorage();
    
    if (storedReviews && storedReviews.length > 0) {
        // Use stored reviews
        reviews = storedReviews;
        displayReviews(reviews);
    } else {
        // If no stored reviews, try to load from JSON file
        try {
            const response = await fetch('reviews.json');
            const jsonReviews = await response.json();
            reviews = jsonReviews;
            // Save initial reviews to localStorage
            saveReviewsToLocalStorage();
            displayReviews(reviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
            // Fallback to default reviews
            reviews = getDefaultReviews();
            saveReviewsToLocalStorage();
            displayReviews(reviews);
        }
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
        complaintContent.style.display = 'flex';
        feedbackContent.style.display = 'none';
    });
}

// ===== COMPLAINT SUBMISSION =====
function setupComplaintSubmission() {
    const form = document.getElementById('complaintForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const stallSelect = document.getElementById('complaintStallSelect');
        const complaintText = document.getElementById('complaintText');
        const categoryRadio = document.querySelector('input[name="category"]:checked');
        
        if (!categoryRadio) {
            alert('Please select a complaint category!');
            return;
        }
        
        // Create new complaint object
        const newComplaint = {
            id: Date.now(), // Use timestamp as unique ID
            stallName: stallSelect.value,
            category: categoryRadio.value,
            description: complaintText.value,
            date: new Date().toISOString().split('T')[0],
            status: 'Under Review'
        };
        
        // Add to complaints array at the beginning
        complaints.unshift(newComplaint);
        
        // Save to localStorage
        saveComplaintsToLocalStorage();
        
        // Show success message
        showComplaintSuccessMessage();
        
        // Clear form
        clearComplaintForm();
        
        // Reload complaints display
        displayComplaints(complaints);
        
        // Scroll to success message
        document.getElementById('complaintSuccessMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function clearComplaintForm() {
    document.getElementById('complaintForm').reset();
}

function showComplaintSuccessMessage() {
    const successMsg = document.getElementById('complaintSuccessMessage');
    successMsg.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// ===== LOCALSTORAGE FUNCTIONS FOR COMPLAINTS =====
function saveComplaintsToLocalStorage() {
    localStorage.setItem('hawkerComplaints', JSON.stringify(complaints));
}

function loadComplaintsFromLocalStorage() {
    const storedComplaints = localStorage.getItem('hawkerComplaints');
    if (storedComplaints) {
        return JSON.parse(storedComplaints);
    }
    return null;
}

// ===== LOAD COMPLAINTS =====
function loadComplaints() {
    // Try to load from localStorage first
    const storedComplaints = loadComplaintsFromLocalStorage();
    
    if (storedComplaints && storedComplaints.length > 0) {
        complaints = storedComplaints;
    } else {
        // Default complaints if none stored
        complaints = [
            {
                id: 1,
                stallName: "Laksa Paradise",
                category: "Long Wait Time",
                description: "Waited over 30 minutes for my order despite ordering early. Multiple customers who came after me received their food first.",
                date: "2026-02-05",
                status: "Under Review"
            },
            {
                id: 2,
                stallName: "Char Kway Teow House",
                category: "Service Issue",
                description: "Staff was rude when I asked for extra chili. They ignored my request and served other customers first.",
                date: "2026-02-04",
                status: "Under Review"
            }
        ];
        // Save initial complaints to localStorage
        saveComplaintsToLocalStorage();
    }
    
    displayComplaints(complaints);
}

// ===== DISPLAY COMPLAINTS =====
function displayComplaints(complaintsToDisplay) {
    const container = document.getElementById('complaintsContainer');
    container.innerHTML = '';
    
    // Show only first 3 complaints
    const complaintsToShow = complaintsToDisplay.slice(0, 3);
    
    if (complaintsToShow.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No complaints submitted yet.</p>';
        return;
    }
    
    complaintsToShow.forEach(complaint => {
        const complaintCard = createComplaintCard(complaint);
        container.appendChild(complaintCard);
    });
}

function createComplaintCard(complaint) {
    const card = document.createElement('div');
    card.className = 'complaint-item';
    
    const statusClass = complaint.status === 'Under Review' ? 'under-review' : 
                       complaint.status === 'Resolved' ? 'resolved' : 'pending';
    
    card.innerHTML = `
        <div class="complaint-status ${statusClass}">
            <i class="fas fa-circle" style="font-size: 8px;"></i>
            ${complaint.status}
        </div>
        <div class="complaint-category-badge">
            ${complaint.category}
        </div>
        <div class="complaint-stall-name">${complaint.stallName}</div>
        <div class="complaint-date">
            <i class="far fa-calendar me-1"></i>
            ${formatDate(complaint.date)}
        </div>
        <div class="complaint-description">${complaint.description}</div>
    `;
    
    return card;
}