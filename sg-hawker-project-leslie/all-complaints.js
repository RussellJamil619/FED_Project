// ===== ALL COMPLAINTS PAGE JAVASCRIPT WITH LOCALSTORAGE =====

let allComplaints = [];

// Load complaints when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAllComplaints();
    setupComplaintFilters();
});

// ===== LOAD ALL COMPLAINTS FROM LOCALSTORAGE =====
function loadAllComplaints() {
    // Load from localStorage
    const storedComplaints = localStorage.getItem('hawkerComplaints');
    
    if (storedComplaints) {
        allComplaints = JSON.parse(storedComplaints);
    } else {
        // Fallback to default complaints
        allComplaints = getDefaultComplaints();
    }
    
    displayAllComplaints(allComplaints);
}

function getDefaultComplaints() {
    return [
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
        },
        {
            id: 3,
            stallName: "Ah Meng's Chicken Rice",
            category: "Hygiene/Food Quality Issue",
            description: "Found a hair in my chicken rice. Very disappointed as I usually enjoy this stall.",
            date: "2026-02-03",
            status: "Resolved"
        },
        {
            id: 4,
            stallName: "Roti Prata Corner",
            category: "Overcharging/Pricing Issue",
            description: "Was charged $8 for a plain prata when the menu stated $1.50. When questioned, they were defensive.",
            date: "2026-02-02",
            status: "Under Review"
        },
        {
            id: 5,
            stallName: "Satay King",
            category: "Wrong Order/Missing Items",
            description: "Ordered 20 sticks of chicken satay but only received 15. Peanut sauce was also missing from my order.",
            date: "2026-02-01",
            status: "Resolved"
        },
        {
            id: 6,
            stallName: "Nasi Lemak Delight",
            category: "Hygiene/Food Quality Issue",
            description: "The chicken was undercooked and still pink inside. This is a serious food safety concern.",
            date: "2026-01-31",
            status: "Resolved"
        },
        {
            id: 7,
            stallName: "Laksa Paradise",
            category: "Service Issue",
            description: "Staff was on their phone while taking my order and got it completely wrong.",
            date: "2026-01-30",
            status: "Under Review"
        },
        {
            id: 8,
            stallName: "Char Kway Teow House",
            category: "Long Wait Time",
            description: "45 minute wait during lunch hour with no explanation or apology from staff.",
            date: "2026-01-29",
            status: "Under Review"
        }
    ];
}

// ===== DISPLAY ALL COMPLAINTS =====
function displayAllComplaints(complaintsToDisplay) {
    const container = document.getElementById('allComplaintsContainer');
    const noResults = document.getElementById('noComplaintsResults');
    
    container.innerHTML = '';
    
    if (complaintsToDisplay.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    complaintsToDisplay.forEach(complaint => {
        const complaintCard = createComplaintCard(complaint);
        container.appendChild(complaintCard);
    });
}

function createComplaintCard(complaint) {
    const card = document.createElement('div');
    card.className = 'complaint-item mb-3';
    
    const statusClass = complaint.status === 'Under Review' ? 'under-review' : 
                       complaint.status === 'Resolved' ? 'resolved' : 'pending';
    
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="complaint-status ${statusClass}">
                <i class="fas fa-circle" style="font-size: 8px;"></i>
                ${complaint.status}
            </div>
            <div class="complaint-date">
                <i class="far fa-calendar me-1"></i>
                ${formatDate(complaint.date)}
            </div>
        </div>
        <div class="complaint-category-badge">
            ${complaint.category}
        </div>
        <div class="complaint-stall-name">${complaint.stallName}</div>
        <div class="complaint-description mt-2">${complaint.description}</div>
    `;
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// ===== FILTERS =====
function setupComplaintFilters() {
    const stallFilter = document.getElementById('filterComplaintStall');
    const categoryFilter = document.getElementById('filterComplaintCategory');
    const sortSelect = document.getElementById('sortComplaintsBy');
    
    stallFilter.addEventListener('change', applyComplaintFilters);
    categoryFilter.addEventListener('change', applyComplaintFilters);
    sortSelect.addEventListener('change', applyComplaintFilters);
}

function applyComplaintFilters() {
    const stallFilter = document.getElementById('filterComplaintStall').value;
    const categoryFilter = document.getElementById('filterComplaintCategory').value;
    const sortType = document.getElementById('sortComplaintsBy').value;
    
    let filteredComplaints = [...allComplaints];
    
    // Filter by stall
    if (stallFilter !== 'all') {
        filteredComplaints = filteredComplaints.filter(complaint => complaint.stallName === stallFilter);
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
        filteredComplaints = filteredComplaints.filter(complaint => complaint.category === categoryFilter);
    }
    
    // Sort
    if (sortType === 'oldest') {
        filteredComplaints.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        // newest (default)
        filteredComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    displayAllComplaints(filteredComplaints);
}