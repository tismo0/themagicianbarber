// ===== Configuration =====
const ADMIN_PASSWORD = "@admin48k";
const STORAGE_KEY = "magician_bookings";
const ADMIN_KEY = "magician_admin";

// ===== State =====
let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let blockedDates = JSON.parse(localStorage.getItem("magician_blocked")) || [];
let announcements = JSON.parse(localStorage.getItem("magician_announcements")) || [];
let isAdminLoggedIn = false;
let selectedDate = null;
let currentMonth = new Date();

// ===== Services & Team =====
const services = {
  "coupe-tondeuse": { name: "Coupe tondeuse", price: 13, duration: 20 },
  "coupe-degrade": { name: "Coupe dégradé", price: 18, duration: 30 },
  "coupe-enfant": { name: "Coupe enfant", price: 15, duration: 25 },
  "barbe-tondeuse": { name: "Barbe tondeuse", price: 5, duration: 10 },
  "barbe-entretien": { name: "Barbe entretien", price: 12, duration: 20 },
  "rasage-ancien": { name: "Rasage à l'ancienne", price: 15, duration: 30 },
  "soin-visage": { name: "Soin visage signature", price: 40, duration: 45 }
};

const team = ["elodie", "malik", "lucia"];
const businessHours = {
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:30" },
  5: { start: "09:00", end: "19:00" },
  6: { start: "09:00", end: "18:00" }
};

// ===== DOM Elements =====
const calendarGrid = document.getElementById("calendar-grid");
const calendarTitle = document.getElementById("calendar-title");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const bookingForm = document.getElementById("booking-form");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const formMessage = document.getElementById("form-message");
const adminBtn = document.getElementById("btn-admin");
const adminModal = document.getElementById("admin-modal");
const adminPanel = document.getElementById("admin-panel");
const adminPassword = document.getElementById("admin-password");
const adminLogin = document.getElementById("admin-login");
const adminLogout = document.getElementById("admin-logout");
const modalClose = document.getElementById("modal-close");
const navbarToggle = document.getElementById("navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  setupEventListeners();
  checkAdminStatus();
});

// ===== Calendar Functions =====
function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Update title
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  calendarTitle.textContent = `${monthNames[month]} ${year}`;

  // Clear grid
  calendarGrid.innerHTML = "";

  // Get first day and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Add empty cells for days before month starts
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day disabled";
    calendarGrid.appendChild(emptyDay);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;

    // Check if date is in the past
    if (date < today) {
      dayElement.classList.add("disabled");
    } else if (isDateBlocked(dateStr)) {
      dayElement.classList.add("disabled");
    } else {
      // Check if has bookings
      if (hasBookingsOnDate(dateStr)) {
        dayElement.classList.add("has-booking");
      }

      dayElement.addEventListener("click", () => selectDate(dateStr, dayElement));
    }

    calendarGrid.appendChild(dayElement);
  }
}

function selectDate(dateStr, element) {
  // Remove previous selection
  document.querySelectorAll(".calendar-day.selected").forEach(el => {
    el.classList.remove("selected");
  });

  // Add selection
  element.classList.add("selected");
  selectedDate = dateStr;
  dateInput.value = dateStr;

  // Update available times
  updateAvailableTimes(dateStr);
}

function updateAvailableTimes(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  // Check if salon is open
  if (!businessHours[dayOfWeek]) {
    timeInput.innerHTML = '<option value="">Fermé ce jour</option>';
    return;
  }

  const hours = businessHours[dayOfWeek];
  const times = generateTimeSlots(hours.start, hours.end);
  const bookedTimes = getBookedTimesForDate(dateStr);

  timeInput.innerHTML = '<option value="">Sélectionnez un horaire</option>';

  times.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;

    if (bookedTimes.includes(time)) {
      option.disabled = true;
      option.textContent += " (Occupé)";
    }

    timeInput.appendChild(option);
  });
}

function generateTimeSlots(start, end) {
  const slots = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  let current = new Date();
  current.setHours(startH, startM, 0);

  const endTime = new Date();
  endTime.setHours(endH, endM, 0);

  while (current < endTime) {
    const hours = String(current.getHours()).padStart(2, "0");
    const minutes = String(current.getMinutes()).padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
}

function hasBookingsOnDate(dateStr) {
  return bookings.some(b => b.date === dateStr);
}

function getBookedTimesForDate(dateStr) {
  return bookings
    .filter(b => b.date === dateStr)
    .map(b => b.time);
}

function isDateBlocked(dateStr) {
  return blockedDates.some(b => b.date === dateStr);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ===== Booking Functions =====
function setupEventListeners() {
  prevMonthBtn.addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
  });

  bookingForm.addEventListener("submit", handleBookingSubmit);
  adminBtn.addEventListener("click", openAdminModal);
  adminLogin.addEventListener("click", handleAdminLogin);
  adminLogout.addEventListener("click", handleAdminLogout);
  modalClose.addEventListener("click", closeAdminModal);
  navbarToggle.addEventListener("click", toggleNavbarMenu);

  // Close modal on outside click
  adminModal.addEventListener("click", (e) => {
    if (e.target === adminModal) closeAdminModal();
  });
}

async function handleBookingSubmit(e) {
  e.preventDefault();

  const formData = {
    id: Date.now().toString(),
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    service: document.getElementById("service").value,
    coiffeur: document.getElementById("coiffeur").value,
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
    email: document.getElementById("email").value,
    instagram: document.getElementById("instagram").value,
    notes: document.getElementById("notes").value,
    createdAt: new Date().toISOString()
  };

  // Validation
  if (!formData.date || !formData.time || !formData.service) {
    showMessage("Veuillez remplir tous les champs obligatoires", "error");
    return;
  }

  // Check if time slot is available
  if (getBookedTimesForDate(formData.date).includes(formData.time)) {
    showMessage("Cet horaire n'est plus disponible", "error");
    return;
  }

  // Save booking
  bookings.push(formData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

  // Show success message
  showMessage("✓ Réservation confirmée ! Nous vous revenons sous 24h.", "success");

  // Reset form
  bookingForm.reset();
  selectedDate = null;
  renderCalendar();

  // Send confirmation email (optional)
  sendConfirmationEmail(formData);
}

function sendConfirmationEmail(booking) {
  // In a real app, this would send to a backend
  console.log("Confirmation email would be sent to:", booking.email);
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  setTimeout(() => {
    formMessage.style.display = "none";
  }, 5000);
}

// ===== Admin Functions =====
function openAdminModal() {
  adminModal.classList.add("active");
  adminPassword.focus();
}

function closeAdminModal() {
  adminModal.classList.remove("active");
  adminPassword.value = "";
}

function handleAdminLogin() {
  const password = adminPassword.value;

  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    localStorage.setItem(ADMIN_KEY, "true");
    closeAdminModal();
    showAdminPanel();
    renderAdminPanel();
  } else {
    document.getElementById("admin-message").textContent = "Code incorrect";
    document.getElementById("admin-message").className = "form-message error";
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  localStorage.removeItem(ADMIN_KEY);
  adminPanel.classList.remove("active");
  adminPanel.classList.add("hidden");
}

function checkAdminStatus() {
  if (localStorage.getItem(ADMIN_KEY) === "true") {
    isAdminLoggedIn = true;
  }
}

function showAdminPanel() {
  adminPanel.classList.remove("hidden");
  adminPanel.classList.add("active");
}

function renderAdminPanel() {
  // Render reservations
  const reservationsList = document.getElementById("reservations-list");
  reservationsList.innerHTML = "";

  bookings.forEach(booking => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.date}</td>
      <td>${booking.time}</td>
      <td>${booking.prenom} ${booking.nom}</td>
      <td>${booking.email}</td>
      <td>${services[booking.service]?.name || booking.service}</td>
      <td>
        <button class="btn-secondary" onclick="deleteBooking('${booking.id}')">Supprimer</button>
      </td>
    `;
    reservationsList.appendChild(row);
  });

  // Setup tab switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      e.target.classList.add("active");
      const tabId = e.target.dataset.tab + "-tab";
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Setup blocked dates
  const blockSubmit = document.getElementById("block-submit");
  blockSubmit.addEventListener("click", () => {
    const date = document.getElementById("block-date").value;
    const reason = document.getElementById("block-reason").value;

    if (date && reason) {
      blockedDates.push({ date, reason });
      localStorage.setItem("magician_blocked", JSON.stringify(blockedDates));
      renderBlockedDates();
      renderCalendar();
    }
  });

  // Setup announcements
  const announcementSubmit = document.getElementById("announcement-submit");
  announcementSubmit.addEventListener("click", () => {
    const text = document.getElementById("announcement-text").value;

    if (text) {
      announcements.push({
        id: Date.now().toString(),
        text,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("magician_announcements", JSON.stringify(announcements));
      document.getElementById("announcement-text").value = "";
      renderAnnouncements();
    }
  });

  renderBlockedDates();
  renderAnnouncements();
}

function renderBlockedDates() {
  const blockedList = document.getElementById("blocked-list");
  blockedList.innerHTML = "";

  blockedDates.forEach((blocked, index) => {
    const div = document.createElement("div");
    div.style.cssText = "padding: 1rem; background: #f0f0f0; border-radius: 8px; margin-top: 1rem;";
    div.innerHTML = `
      <p><strong>${blocked.date}</strong> - ${blocked.reason}</p>
      <button class="btn-secondary" onclick="removeBlockedDate(${index})">Débloquer</button>
    `;
    blockedList.appendChild(div);
  });
}

function renderAnnouncements() {
  const announcementsList = document.getElementById("announcements-list");
  announcementsList.innerHTML = "";

  announcements.forEach((ann, index) => {
    const div = document.createElement("div");
    div.style.cssText = "padding: 1rem; background: #f0f0f0; border-radius: 8px; margin-top: 1rem;";
    div.innerHTML = `
      <p>${ann.text}</p>
      <button class="btn-secondary" onclick="removeAnnouncement(${index})">Supprimer</button>
    `;
    announcementsList.appendChild(div);
  });
}

function deleteBooking(id) {
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  renderAdminPanel();
  renderCalendar();
}

function removeBlockedDate(index) {
  blockedDates.splice(index, 1);
  localStorage.setItem("magician_blocked", JSON.stringify(blockedDates));
  renderBlockedDates();
  renderCalendar();
}

function removeAnnouncement(index) {
  announcements.splice(index, 1);
  localStorage.setItem("magician_announcements", JSON.stringify(announcements));
  renderAnnouncements();
}

// ===== Navbar Toggle =====
function toggleNavbarMenu() {
  navbarMenu.classList.toggle("active");
}

// Close menu when clicking on a link
document.querySelectorAll(".navbar-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navbarMenu.classList.remove("active");
  });
});
