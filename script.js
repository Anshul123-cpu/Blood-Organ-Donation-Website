// ============================================
// DONATION WEBSITE - JAVASCRIPT
// ============================================

// Store user data in localStorage
class DonationSystem {
    constructor() {
        this.storageKey = 'donationUserData';
        this.bloodDonationKey = 'bloodDonationData';
        this.organDonationKey = 'organDonationData';
        this.init();
    }

    init() {
        this.handleRegistration();
        this.loadDashboard();
        this.handleBloodDonation();
        this.handleOrganDonation();
    }

    // ============ USER REGISTRATION ============

    handleRegistration() {
        const form = document.getElementById('registrationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const userData = {
                fullName: document.getElementById('fullName').value.trim(),
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                address: document.getElementById('address').value.trim(),
                mobile: document.getElementById('mobile').value.trim(),
                email: document.getElementById('email').value.trim(),
                registeredDate: new Date().toLocaleDateString()
            };

            // Validate data
            if (!this.validateUserData(userData)) {
                alert('Please fill all required fields correctly');
                return;
            }

            // Store in localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(userData));

            // Show success message
            this.showNotification('Registration successful! Redirecting to home...', 'success');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    validateUserData(userData) {
        const ages = parseInt(userData.age);
        // Age should be between 18 and 120
        if (ages < 18 || ages > 120) return false;
        // Mobile should be 10 digits
        if (!/^\d{10}$/.test(userData.mobile)) return false;
        // Email should be valid
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) return false;
        return true;
    }

    // ============ DASHBOARD FUNCTIONS ============

    loadDashboard() {
        const userData = this.getUserData();
        if (!userData) return;

        // Update welcome message
        const greeting = document.getElementById('userGreeting');
        if (greeting) {
            greeting.textContent = `Welcome back, ${userData.fullName}! Thank you for being part of our mission to save lives.`;
        }

        // Display user info
        this.displayUserInfo(userData);
    }

    displayUserInfo(userData) {
        const fields = ['fullName', 'age', 'gender', 'address', 'mobile', 'email'];
        const displayMap = {
            'fullName': 'displayName',
            'age': 'displayAge',
            'gender': 'displayGender',
            'address': 'displayAddress',
            'mobile': 'displayMobile',
            'email': 'displayEmail'
        };

        fields.forEach(field => {
            const element = document.getElementById(displayMap[field]);
            if (element) {
                element.textContent = userData[field];
            }
        });

        // Auto-fill name fields in donation forms
        document.getElementById('bloodName')?.setAttribute('value', userData.fullName);
        document.getElementById('organName')?.setAttribute('value', userData.fullName);
    }

    // ============ BLOOD DONATION ============

    handleBloodDonation() {
        const form = document.getElementById('bloodDonationForm');
        if (!form) return;

        // Load user data
        const userData = this.getUserData();
        if (userData && document.getElementById('bloodName')) {
            document.getElementById('bloodName').value = userData.fullName;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const bloodData = {
                name: document.getElementById('bloodName').value,
                bloodGroup: document.getElementById('bloodGroup').value,
                donationDate: document.getElementById('donationDate').value,
                medicalHistory: document.getElementById('medicalHistory').value.trim(),
                bloodConsent: document.getElementById('bloodConsent').checked,
                healthConsent: document.getElementById('healthConsent').checked,
                termsConsent: document.getElementById('termsConsent').checked,
                submittedDate: new Date().toLocaleDateString(),
                submittedTime: new Date().toLocaleTimeString()
            };

            // Validate
            if (!this.validateBloodDonation(bloodData)) {
                alert('Please fill all required fields and accept all consents');
                return;
            }

            // Check if at least one consent is checked
            if (!bloodData.bloodConsent || !bloodData.healthConsent || !bloodData.termsConsent) {
                alert('You must accept all consent forms to proceed');
                return;
            }

            // Store data
            let allBloodDonations = JSON.parse(localStorage.getItem(this.bloodDonationKey)) || [];
            allBloodDonations.push(bloodData);
            localStorage.setItem(this.bloodDonationKey, JSON.stringify(allBloodDonations));

            // Show success
            this.showNotification(`Blood donation registration successful! Your blood group ${bloodData.bloodGroup} is registered.`, 'success');

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }

    validateBloodDonation(data) {
        if (!data.bloodGroup || !data.donationDate || !data.medicalHistory) {
            return false;
        }
        return true;
    }

    // ============ ORGAN DONATION ============

    handleOrganDonation() {
        const form = document.getElementById('organDonationForm');
        if (!form) return;

        // Load user data
        const userData = this.getUserData();
        if (userData && document.getElementById('organName')) {
            document.getElementById('organName').value = userData.fullName;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get selected organs
            const selectedOrgans = Array.from(document.querySelectorAll('input[name="organs"]:checked'))
                .map(el => el.value);

            if (selectedOrgans.length === 0) {
                alert('Please select at least one organ to donate');
                return;
            }

            // Get form values
            const organData = {
                name: document.getElementById('organName').value,
                bloodGroup: document.getElementById('organBloodGroup').value,
                registrationDate: document.getElementById('organRegistrationDate').value,
                medicalHistory: document.getElementById('organMedicalHistory').value.trim(),
                organs: selectedOrgans,
                organConsent1: document.getElementById('organConsent1').checked,
                organConsent2: document.getElementById('organConsent2').checked,
                organConsent3: document.getElementById('organConsent3').checked,
                organConsent4: document.getElementById('organConsent4').checked,
                emergencyContact: document.getElementById('emergencyContact').value.trim(),
                submittedDate: new Date().toLocaleDateString(),
                submittedTime: new Date().toLocaleTimeString()
            };

            // Validate
            if (!this.validateOrganDonation(organData)) {
                alert('Please fill all required fields');
                return;
            }

            // Check all consents
            if (!organData.organConsent1 || !organData.organConsent2 || !organData.organConsent3 || !organData.organConsent4) {
                alert('You must accept all consent forms to proceed');
                return;
            }

            // Store data
            let allOrganDonations = JSON.parse(localStorage.getItem(this.organDonationKey)) || [];
            allOrganDonations.push(organData);
            localStorage.setItem(this.organDonationKey, JSON.stringify(allOrganDonations));

            // Show success
            this.showNotification(`Organ donation registration successful! You have registered to donate: ${selectedOrgans.join(', ')}.`, 'success');

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }

    validateOrganDonation(data) {
        if (!data.bloodGroup || !data.registrationDate || !data.medicalHistory || data.organs.length === 0) {
            return false;
        }
        return true;
    }

    // ============ UTILITY FUNCTIONS ============

    getUserData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : '#0c5460'};
            border: 2px solid ${type === 'success' ? '#51cf66' : '#0c5460'};
            border-radius: 6px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.4s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

// ============ LOGOUT FUNCTION ============

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Keep user data but redirect to home
        window.location.href = 'index.html';
    }
}

// ============ CHECK USER AND NAVIGATE ============

function checkUserAndNavigate(page) {
    const userData = localStorage.getItem('donationUserData');
    if (!userData) {
        // User not registered, redirect to registration
        alert('Please register your personal details first to proceed with donation registration.');
        window.location.href = 'registration.html';
    } else {
        // User is registered, allow navigation
        window.location.href = page;
    }
}

// ============ CONTACT FORM HANDLER ============

function handleContactForm(event) {
    event.preventDefault();
    
    // Get form values
    const form = event.target;
    const formData = new FormData(form);
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    // Store contact message (in real app, this would be sent to a server)
    const contactMessage = {
        name: name,
        email: email,
        message: message,
        submittedDate: new Date().toLocaleDateString(),
        submittedTime: new Date().toLocaleTimeString()
    };
    
    // Store in localStorage
    let allMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    allMessages.push(contactMessage);
    localStorage.setItem('contactMessages', JSON.stringify(allMessages));
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-notification';
    successMsg.textContent = 'Thank you for your message! We will get back to you soon.';
    successMsg.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 15px;
        border-left: 4px solid #51cf66;
        font-weight: 600;
        animation: slideIn 0.4s ease;
    `;
    
    form.parentElement.insertBefore(successMsg, form);
    
    // Clear form
    form.reset();
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => successMsg.remove(), 400);
    }, 5000);
}

// ============ FORM VALIDATION ON INPUT ============

// Real-time validation for phone number
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('mobile');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    // Real-time age validation
    const ageInput = document.getElementById('age');
    if (ageInput) {
        ageInput.addEventListener('input', (e) => {
            if (e.target.value < 18) {
                e.target.title = 'Must be 18 or older';
            } else if (e.target.value > 120) {
                e.target.value = 120;
            }
        });
    }

    // Initialize the donation system
    new DonationSystem();
});

// ============ LOCAL STORAGE DEBUGGING ============

// Uncomment to view stored data in console
// console.log('User Data:', localStorage.getItem('donationUserData'));
// console.log('Blood Data:', localStorage.getItem('bloodDonationData'));
// console.log('Organ Data:', localStorage.getItem('organDonationData'));

// Function to clear all data (use with caution)
function clearAllData() {
    if (confirm('This will delete all stored data. Are you sure?')) {
        localStorage.clear();
        alert('All data cleared!');
        location.reload();
    }
}

// Function to export data (for admin/testing)
function exportData() {
    const userData = localStorage.getItem('donationUserData');
    const bloodData = localStorage.getItem('bloodDonationData');
    const organData = localStorage.getItem('organDonationData');

    const allData = {
        userRegistrations: userData ? JSON.parse(userData) : null,
        bloodDonations: bloodData ? JSON.parse(bloodData) : [],
        organDonations: organData ? JSON.parse(organData) : []
    };

    console.log('=== EXPORTED DATA ===');
    console.log(JSON.stringify(allData, null, 2));
    
    // Download as JSON file
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donation-data-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
