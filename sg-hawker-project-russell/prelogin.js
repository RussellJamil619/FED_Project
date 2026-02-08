
const signInBtn = document.getElementById('signInBtn');
const createAccountBtn = document.getElementById('createAccountBtn');
const signInModal = document.getElementById('signInModal');
const createAccountModal = document.getElementById('createAccountModal');
const closeBtns = document.querySelectorAll('.close-btn');
const signInForm = document.getElementById('signInForm');
const createAccountForm = document.getElementById('createAccountForm');
const successMessage = document.getElementById('successMessage');

// ============ FIREBASE CONFIG ============
const firebaseConfig = {
  apiKey: "AIzaSyAQJ_5bvld7FvcJAgex7RPO0rPyXLxZOjc",
  authDomain: "russellfedproject.firebaseapp.com",
  projectId: "russellfedproject",
  storageBucket: "russellfedproject.firebasestorage.app",
  messagingSenderId: "645071996143",
  appId: "1:645071996143:web:1942c9aa7902c5b200471a",
  measurementId: "G-RCVB4JTSWG"
};
// ==================================================

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized!");
} catch (error) {
  console.log("Firebase init error:", error);
}

const auth = firebase.auth();

// Simple modals
signInBtn.addEventListener('click', () => signInModal.style.display = 'flex');
createAccountBtn.addEventListener('click', () => createAccountModal.style.display = 'flex');
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        signInModal.style.display = 'none';
        createAccountModal.style.display = 'none';
    });
});

// Simple Sign In
signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const btn = signInForm.querySelector('button');
    btn.innerHTML = 'Signing in...';
    btn.disabled = true;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert('Login OK!');
            window.location.href = 'order2.html';
        })
        .catch(error => {
            alert('Login error: ' + error.message);
            btn.innerHTML = 'Sign In';
            btn.disabled = false;
        });
});

// Simple Create Account
createAccountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    
    const btn = createAccountForm.querySelector('button');
    btn.innerHTML = 'Creating...';
    btn.disabled = true;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            successMessage.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'order2.html';
            }, 1500);
        })
        .catch(error => {
            alert('Create error: ' + error.message);
            btn.innerHTML = 'Create Account';
            btn.disabled = false;
        });
});

// Animation
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});