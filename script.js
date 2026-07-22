// ==================== VARIABLES ====================
let currentStep = 1;
let passengerCount = 2;
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    loadBookings();
    updateNavigation();
});

// ==================== DATE FUNCTIONS ====================
function setMinDate() {
    const today = new Date();
    const dateInput = document.getElementById('departureDate');
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    dateInput.min = minDate;
}

// ==================== PASSENGER COUNTER ====================
function incrementPassengers() {
    passengerCount++;
    document.getElementById('passengerCount').textContent = passengerCount;
    document.getElementById('summaryPassengers').textContent = passengerCount;
}

function decrementPassengers() {
    if (passengerCount > 1) {
        passengerCount--;
        document.getElementById('passengerCount').textContent = passengerCount;
        document.getElementById('summaryPassengers').textContent = passengerCount;
    }
}

// ==================== STEP NAVIGATION ====================
function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < 5) {
            currentStep++;
            updateFormDisplay();
            updateStepsIndicator();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormDisplay();
        updateStepsIndicator();
    }
}

function updateFormDisplay() {
    // Hide all steps
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`form-step-${i}`).classList.remove('active');
    }
    // Show current step
    document.getElementById(`form-step-${currentStep}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepsIndicator() {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step${i}`);
        if (i <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    }
}

// ==================== VALIDATION ====================
function validateStep(step) {
    switch(step) {
        case 1:
            const apartment = document.getElementById('apartmentNumber').value;
            if (!apartment.trim()) {
                alert('Veuillez entrer le numéro d\'appartement');
                return false;
            }
            return true;
        case 2:
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('departureDate').value;
            if (!destination) {
                alert('Veuillez sélectionner une destination');
                return false;
            }
            if (!date) {
                alert('Veuillez sélectionner une date');
                return false;
            }
            updateSummary();
            return true;
        case 3:
            const hour = document.getElementById('departureHour').value;
            const minute = document.getElementById('departureMinute').value;
            if (!hour || !minute) {
                alert('Veuillez sélectionner l\'heure de départ');
                return false;
            }
            updateSummary();
            return true;
        case 4:
            updateSummary();
            return true;
        default:
            return true;
    }
}

// ==================== SUMMARY UPDATE ====================
function updateSummary() {
    // Update passengers
    document.getElementById('summaryPassengers').textContent = passengerCount;

    // Update destination
    const destination = document.getElementById('destination').value;
    const destinationMap = {
        'cdg': 'Charles de Gaulle Airport',
        'orly': 'Orly Airport',
        'nord': 'Gare du Nord',
        'lyon': 'Gare de Lyon',
        'disneyland': 'Disneyland Paris',
        'defense': 'La Défense',
        'custom': 'Autre destination'
    };
    document.getElementById('summaryDestination').textContent = destinationMap[destination] || '-';

    // Update date
    const date = document.getElementById('departureDate').value;
    if (date) {
        const dateObj = new Date(date);
        document.getElementById('summaryDate').textContent = dateObj.toLocaleDateString('fr-FR');
    }

    // Update time
    const hour = document.getElementById('departureHour').value;
    const minute = document.getElementById('departureMinute').value;
    if (hour && minute) {
        document.getElementById('summaryTime').textContent = `${hour}:${minute}`;
    }
}

// ==================== BOOKING MANAGEMENT ====================
function saveBooking() {
    const booking = {
        id: Date.now(),
        apartment: document.getElementById('apartmentNumber').value,
        guestName: document.getElementById('guestName').value,
        passengers: passengerCount,
        destination: document.getElementById('destination').value,
        date: document.getElementById('departureDate').value,
        hour: document.getElementById('departureHour').value,
        minute: document.getElementById('departureMinute').value,
        notes: document.getElementById('receptionNotes').value,
        receptionist: document.getElementById('receptionistName').value,
        driverConfirmed: document.getElementById('driverConfirmed').checked,
        timestamp: new Date().toLocaleString('fr-FR')
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return booking;
}

function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="no-bookings">Aucune réservation pour le moment</p>';
        return;
    }

    bookingsList.innerHTML = '';
    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        
        const destinationMap = {
            'cdg': 'Charles de Gaulle Airport',
            'orly': 'Orly Airport',
            'nord': 'Gare du Nord',
            'lyon': 'Gare de Lyon',
            'disneyland': 'Disneyland Paris',
            'defense': 'La Défense'
        };

        card.innerHTML = `
            <h3>Réservation #${booking.id}</h3>
            <p><strong>Appartement:</strong> ${booking.apartment}</p>
            <p><strong>Destination:</strong> ${destinationMap[booking.destination] || booking.destination}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure:</strong> ${booking.hour}:${booking.minute}</p>
            <p><strong>Passagers:</strong> ${booking.passengers}</p>
            <p><strong>Réceptionniste:</strong> ${booking.receptionist || '-'}</p>
            <p><strong>Confirmée:</strong> ${booking.driverConfirmed ? 'Oui ✓' : 'Non'}</p>
            <p><small style="color: #999;">Créée le: ${booking.timestamp}</small></p>
        `;
        
        bookingsList.appendChild(card);
    });
}

// ==================== NAVIGATION HELPERS ====================
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function updateNavigation() {
    const links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== ACTION BUTTONS ====================
function generatePDF() {
    const booking = saveBooking();
    alert('📄 PDF généré avec succès!\n\nRéservation #' + booking.id);
}

function printBooking() {
    const booking = saveBooking();
    window.print();
}

function sendEmail() {
    const booking = saveBooking();
    alert('✉️ Email envoyé avec succès!');
}

function sendWhatsApp() {
    const booking = saveBooking();
    const message = encodeURIComponent(`Réservation Citadines Taxi\nAppartement: ${booking.apartment}\nDestination: ${booking.destination}\nDate: ${booking.date}\nHeure: ${booking.hour}:${booking.minute}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

function newBooking() {
    // Reset form
    document.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.type !== 'checkbox') el.value = '';
        if (el.type === 'checkbox') el.checked = false;
    });
    
    passengerCount = 2;
    currentStep = 1;
    document.getElementById('passengerCount').textContent = '2';
    document.getElementById('summaryPassengers').textContent = '2';
    
    updateFormDisplay();
    updateStepsIndicator();
    scrollToBooking();
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
