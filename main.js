const ADMIN_PASSWORD = "@admin48k";
const STORAGE_KEY = "magician_bookings";
const ADMIN_KEY = "magician_admin";
const ADMIN_IP_KEY = "magician_admin_ip";
const ADMIN_TIMEOUT = 24 * 60 * 60 * 1000; // 24 heures

let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let blockedDates = JSON.parse(localStorage.getItem("magician_blocked")) || [];
let blockedHours = JSON.parse(localStorage.getItem("magician_blocked_hours")) || [];
let announcements = JSON.parse(localStorage.getItem("magician_announcements")) || [];
let isAdminLoggedIn = false;
let selectedDate = null;
let currentMonth = new Date();
let userIP = null;

const services = {
  "coupe-tondeuse": { name: "Coupe tondeuse", price: 13, duration: 20 },
  "coupe-degrade": { name: "Coupe dégradé", price: 18, duration: 30 },
  "coupe-enfant": { name: "Coupe enfant", price: 15, duration: 25 },
  "barbe-tondeuse": { name: "Barbe tondeuse", price: 5, duration: 10 },
  "barbe-entretien": { name: "Barbe entretien", price: 12, duration: 20 },
  "rasage-ancien": { name: "Rasage à l'ancienne", price: 15, duration: 30 },
  "soin-visage": { name: "Soin visage signature", price: 40, duration: 45 },
  "massage-cranien": { name: "Massage crânien", price: 25, duration: 30 },
  "traitement-barbe": { name: "Traitement barbe", price: 20, duration: 25 }
};

const team = ["malik", "elodie", "lucia"];
const businessHours = {
  1: { start: "09:00", end: "18:00" },
  2: { start: "09:00", end: "18:00" },
  3: { start: "09:00", end: "18:00" },
  4: { start: "09:00", end: "18:30" },
  5: { start: "09:00", end: "19:00" },
  6: { start: "09:00", end: "18:00" }
};

document.addEventListener("DOMContentLoaded", async () => {
  await getUserIP();
  renderCalendar();
  updateCalendarLegend();
  setupEventListeners();
  checkAdminStatus();
  displayAnnouncements();
});

function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  document.getElementById("calendar-title").textContent = `${monthNames[month]} ${year}`;

  const calendarGrid = document.getElementById("calendar-grid");
  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxStylists = team.length;

  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day disabled";
    calendarGrid.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;

    if (date < today) {
      dayElement.classList.add("disabled");
    } else if (isDateBlocked(dateStr)) {
      dayElement.classList.add("closed");
    } else {
      if (hasBookingsOnDate(dateStr)) {
        dayElement.classList.add("has-booking");
      }
      dayElement.addEventListener("click", () => selectDate(dateStr, dayElement));
    }

    calendarGrid.appendChild(dayElement);
  }
}

function selectDate(dateStr, element) {
  document.querySelectorAll(".calendar-day.selected").forEach(el => {
    el.classList.remove("selected");
  });
  element.classList.add("selected");
  selectedDate = dateStr;
  document.getElementById("date").value = dateStr;
  updateAvailableTimes(dateStr);
}

function updateAvailableTimes(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const timeInput = document.getElementById("time");

  if (!businessHours[dayOfWeek]) {
    timeInput.innerHTML = '<option value="">Fermé ce jour</option>';
    return;
  }

  const hours = businessHours[dayOfWeek];
  const times = generateTimeSlots(hours.start, hours.end);
  const bookedTimes = getBookedTimesForDate(dateStr);
  const blockedTimesForDate = blockedHours.filter(b => b.date === dateStr).map(b => b.time);

  timeInput.innerHTML = '<option value="">Sélectionnez un horaire</option>';
  times.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    
    const bookedCount = bookedTimes.filter(t => t === time).length;

    if (blockedTimesForDate.includes(time)) {
      option.disabled = true;
      option.textContent += " (Indisponible)";
    } else if (bookedCount >= team.length) {
      option.disabled = true;
      option.textContent += " (Complet)";
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
  return bookings.filter(b => b.date === dateStr).map(b => b.time);
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

function setupEventListeners() {
  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
    updateCalendarLegend();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
    updateCalendarLegend();
  });

  document.getElementById("booking-form").addEventListener("submit", handleBookingSubmit);
  document.getElementById("btn-admin").addEventListener("click", openAdminModal);
  document.getElementById("admin-login").addEventListener("click", handleAdminLogin);
  document.getElementById("admin-logout").addEventListener("click", handleAdminLogout);
  document.getElementById("admin-close").addEventListener("click", closeAdminPanel);
  document.getElementById("modal-close").addEventListener("click", closeAdminModal);
  document.getElementById("navbar-toggle").addEventListener("click", toggleNavbarMenu);
  document.getElementById("search-bookings").addEventListener("click", searchBookings);

  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const tabId = e.target.dataset.tab + "-tab";
      document.getElementById(tabId).classList.add("active");
    });
  });

  document.getElementById("block-submit").addEventListener("click", blockDate);
  document.getElementById("announcement-submit").addEventListener("click", addAnnouncement);
  document.getElementById("admin-modal").addEventListener("click", (e) => {
    if (e.target.id === "admin-modal") closeAdminModal();
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
    prenom: document.getElementById("prenom").value,
    nom: document.getElementById("nom").value,
    email: document.getElementById("email").value,
    instagram: document.getElementById("instagram").value,
    notes: document.getElementById("notes").value,
    createdAt: new Date().toISOString()
  };

  if (!formData.date || !formData.time || !formData.service || !formData.email) {
    showMessage("Veuillez remplir tous les champs obligatoires", "error");
    return;
  }

  if (getBookedTimesForDate(formData.date).includes(formData.time)) {
    showMessage("Cet horaire n'est plus disponible", "error");
    return;
  }

  bookings.push(formData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

  showMessage("✓ Réservation confirmée ! Nous vous revenons sous 24h.", "success");
  document.getElementById("booking-form").reset();
  selectedDate = null;
  renderCalendar();
  updateCalendarLegend();
}

function showMessage(message, type) {
  const formMessage = document.getElementById("form-message");
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  setTimeout(() => {
    formMessage.className = "form-message";
  }, 5000);
}

function openAdminModal() {
  document.getElementById("admin-modal").classList.add("active");
  document.getElementById("admin-password").focus();
}

function closeAdminModal() {
  document.getElementById("admin-modal").classList.remove("active");
  document.getElementById("admin-password").value = "";
}

function handleAdminLogin() {
  const password = document.getElementById("admin-password").value;
  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    const adminData = {
      ip: userIP,
      timestamp: Date.now()
    };
    localStorage.setItem(ADMIN_IP_KEY, JSON.stringify(adminData));
    closeAdminModal();
    openAdminPanel();
  } else {
    document.getElementById("admin-message").textContent = "Code incorrect";
    document.getElementById("admin-message").className = "form-message error";
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  localStorage.removeItem(ADMIN_KEY);
  closeAdminPanel();
}

function checkAdminStatus() {
  const adminData = JSON.parse(localStorage.getItem(ADMIN_IP_KEY));
  
  if (adminData && adminData.timestamp) {
    const elapsed = Date.now() - adminData.timestamp;
    
    if (elapsed < ADMIN_TIMEOUT && adminData.ip === userIP) {
      isAdminLoggedIn = true;
      adminData.timestamp = Date.now();
      localStorage.setItem(ADMIN_IP_KEY, JSON.stringify(adminData));
    } else {
      localStorage.removeItem(ADMIN_IP_KEY);
      isAdminLoggedIn = false;
    }
  }
}

async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP = data.ip;
  } catch (e) {
    userIP = "unknown";
  }
}

function openAdminPanel() {
  document.getElementById("admin-panel").classList.add("active");
  renderAdminPanel();
}

function closeAdminPanel() {
  document.getElementById("admin-panel").classList.remove("active");
}

function renderAdminPanel() {
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

  renderBlockedDates();
  renderBlockedHours();
  renderAnnouncements();
  updateDashboard();
}

function updateDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const todayBookings = bookings.filter(b => b.date === formatDate(today));
  const weekBookings = bookings.filter(b => {
    const bDate = new Date(b.date);
    return bDate >= today && bDate <= weekEnd;
  });

  document.getElementById("stat-bookings").textContent = bookings.length;
  document.getElementById("stat-today").textContent = todayBookings.length;
  document.getElementById("stat-week").textContent = weekBookings.length;

  const upcomingBookings = document.getElementById("upcoming-bookings");
  upcomingBookings.innerHTML = "<h3>Prochaines réservations</h3>";
  bookings.slice(0, 5).forEach(booking => {
    const div = document.createElement("div");
    div.className = "upcoming-booking";
    div.innerHTML = `
      <p><strong>${booking.date} à ${booking.time}</strong></p>
      <p>${booking.prenom} ${booking.nom} - ${services[booking.service]?.name}</p>
      <p>${booking.email}</p>
    `;
    upcomingBookings.appendChild(div);
  });
}

function blockDate() {
  const date = document.getElementById("block-date").value;
  const reason = document.getElementById("block-reason").value;

  if (date && reason) {
    blockedDates.push({ date, reason });
    localStorage.setItem("magician_blocked", JSON.stringify(blockedDates));
    document.getElementById("block-date").value = "";
    document.getElementById("block-reason").value = "";
    renderBlockedDates();
    renderCalendar();
    updateCalendarLegend();
    displayAnnouncements();
  }
}

function blockHour() {
  const date = document.getElementById("block-hour-date").value;
  const time = document.getElementById("block-hour-time").value;

  if (date && time) {
    blockedHours.push({ date, time });
    localStorage.setItem("magician_blocked_hours", JSON.stringify(blockedHours));
    document.getElementById("block-hour-date").value = "";
    document.getElementById("block-hour-time").value = "";
    renderBlockedHours();
    renderCalendar();
    updateCalendarLegend();
  }
}

function updateCalendarLegend() {
  const legend = document.querySelector(".calendar-legend");
  if (!legend) return;
  
  legend.innerHTML = `
    <div>
      <span class="legend-available"></span> Disponible
    </div>
    <div>
      <span class="legend-booked"></span> Réservations
    </div>
    <div>
      <span class="legend-closed"></span> Fermé
    </div>
  `;
}

function renderBlockedHours() {
  const blockedHoursList = document.getElementById("blocked-hours-list");
  if (!blockedHoursList) return;
  
  blockedHoursList.innerHTML = "";
  blockedHours.forEach((blocked, index) => {
    const div = document.createElement("div");
    div.className = "blocked-item";
    div.innerHTML = `
      <div>
        <p><strong>${blocked.date} à ${blocked.time}</strong></p>
      </div>
      <button class="btn-secondary" onclick="removeBlockedHour(${index})">Débloquer</button>
    `;
    blockedHoursList.appendChild(div);
  });
}

function removeBlockedHour(index) {
  blockedHours.splice(index, 1);
  localStorage.setItem("magician_blocked_hours", JSON.stringify(blockedHours));
  renderBlockedHours();
  renderCalendar();
  updateCalendarLegend();
}

function renderBlockedDates() {
  const blockedList = document.getElementById("blocked-list");
  blockedList.innerHTML = "";

  blockedDates.forEach((blocked, index) => {
    const div = document.createElement("div");
    div.className = "blocked-item";
    div.innerHTML = `
      <div>
        <p><strong>${blocked.date}</strong> - ${blocked.reason}</p>
      </div>
      <button class="btn-secondary" onclick="removeBlockedDate(${index})">Débloquer</button>
    `;
    blockedList.appendChild(div);
  });
}

function removeBlockedDate(index) {
  blockedDates.splice(index, 1);
  localStorage.setItem("magician_blocked", JSON.stringify(blockedDates));
  renderBlockedDates();
  renderCalendar();
  updateCalendarLegend();
  displayAnnouncements();
}

function addAnnouncement() {
  const text = document.getElementById("announcement-text").value;
  const type = document.getElementById("announcement-type").value;

  if (text) {
    announcements.push({
      id: Date.now().toString(),
      text,
      type,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("magician_announcements", JSON.stringify(announcements));
    document.getElementById("announcement-text").value = "";
    renderAnnouncements();
    displayAnnouncements();
  }
}

function renderAnnouncements() {
  const announcementsList = document.getElementById("announcements-list");
  announcementsList.innerHTML = "";

  announcements.forEach((ann, index) => {
    const div = document.createElement("div");
    div.className = "announcement-item";
    div.innerHTML = `
      <div>
        <p><strong>${ann.type.toUpperCase()}</strong></p>
        <p>${ann.text}</p>
      </div>
      <button class="btn-secondary" onclick="removeAnnouncement(${index})">Supprimer</button>
    `;
    announcementsList.appendChild(div);
  });
}

function removeAnnouncement(index) {
  announcements.splice(index, 1);
  localStorage.setItem("magician_announcements", JSON.stringify(announcements));
  renderAnnouncements();
  displayAnnouncements();
}

function displayAnnouncements() {
  const banner = document.getElementById("announcements-banner");
  banner.innerHTML = "";

  const activeAnnouncements = announcements.filter(a => a.type === "closed" || a.type === "warning");
  
  // Ajouter les raisons de fermeture des jours bloqués
  blockedDates.forEach(blocked => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const blockedDate = new Date(blocked.date);
    
    if (blockedDate >= today) {
      activeAnnouncements.push({
        text: `${blocked.date}: ${blocked.reason}`,
        type: "closed"
      });
    }
  });

  if (activeAnnouncements.length > 0) {
    banner.classList.add("active");
    activeAnnouncements.forEach(ann => {
      const p = document.createElement("p");
      p.textContent = ann.text;
      banner.appendChild(p);
    });
  }
}

function deleteBooking(id) {
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  renderAdminPanel();
  renderCalendar();
  updateCalendarLegend();
}

function searchBookings() {
  const email = document.getElementById("search-email").value;
  const bookingsList = document.getElementById("bookings-list");
  bookingsList.innerHTML = "";

  if (!email) {
    bookingsList.innerHTML = "<p style='text-align: center; color: #999;'>Entrez votre email pour voir vos réservations</p>";
    return;
  }

  const userBookings = bookings.filter(b => b.email.toLowerCase() === email.toLowerCase());

  if (userBookings.length === 0) {
    bookingsList.innerHTML = "<p style='text-align: center; color: #999;'>Aucune réservation trouvée</p>";
    return;
  }

  userBookings.forEach(booking => {
    const div = document.createElement("div");
    div.className = "booking-item";
    div.innerHTML = `
      <h4>${booking.date} à ${booking.time}</h4>
      <p><strong>Service:</strong> ${services[booking.service]?.name}</p>
      <p><strong>Coiffeur:</strong> ${booking.coiffeur}</p>
      <p><strong>Nom:</strong> ${booking.prenom} ${booking.nom}</p>
      <p><strong>Notes:</strong> ${booking.notes || "Aucune"}</p>
      <div class="booking-actions">
        <button class="btn-edit" onclick="editBooking('${booking.id}')">Modifier</button>
        <button class="btn-delete" onclick="cancelBooking('${booking.id}')">Annuler</button>
      </div>
    `;
    bookingsList.appendChild(div);
  });
}

function editBooking(id) {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return;

  const modal = document.createElement("div");
  modal.className = "modal active";
  modal.id = "edit-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="document.getElementById('edit-modal').remove()">×</button>
      <h2>Modifier la réservation</h2>
      <form id="edit-form">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="edit-date" value="${booking.date}" required />
        </div>
        <div class="form-group">
          <label>Horaire</label>
          <select id="edit-time" required>
            <option value="${booking.time}">${booking.time}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea id="edit-notes" rows="3">${booking.notes || ""}</textarea>
        </div>
        <button type="submit" class="btn-primary">Enregistrer</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("edit-date").addEventListener("change", (e) => {
    updateEditTimes(e.target.value, booking.time);
  });

  document.getElementById("edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newDate = document.getElementById("edit-date").value;
    const newTime = document.getElementById("edit-time").value;
    const newNotes = document.getElementById("edit-notes").value;

    booking.date = newDate;
    booking.time = newTime;
    booking.notes = newNotes;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    document.getElementById("edit-modal").remove();
    searchBookings();
    renderCalendar();
    updateCalendarLegend();
    showMessage("Réservation modifiée avec succès", "success");
  });

  updateEditTimes(booking.date, booking.time);
}

function updateEditTimes(dateStr, currentTime) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const timeSelect = document.getElementById("edit-time");

  if (!businessHours[dayOfWeek]) {
    timeSelect.innerHTML = '<option value="">Fermé ce jour</option>';
    return;
  }

  const hours = businessHours[dayOfWeek];
  const times = generateTimeSlots(hours.start, hours.end);
  const bookedTimes = getBookedTimesForDate(dateStr);
  const blockedTimesForDate = blockedHours.filter(b => b.date === dateStr).map(b => b.time);

  timeSelect.innerHTML = "";
  times.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    
    const bookedCount = bookedTimes.filter(t => t === time).length;

    if (time === currentTime) {
      option.selected = true;
    }
    
    if (blockedTimesForDate.includes(time) && time !== currentTime) {
      option.disabled = true;
      option.textContent += " (Indisponible)";
    } else if (bookedCount >= team.length && time !== currentTime) {
      option.disabled = true;
      option.textContent += " (Complet)";
    }
    timeSelect.appendChild(option);
  });
}

function cancelBooking(id) {
  if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    searchBookings();
    renderCalendar();
    updateCalendarLegend();
  }
}

function toggleNavbarMenu() {
  document.querySelector(".navbar-menu").classList.toggle("active");
}

document.querySelectorAll(".navbar-menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".navbar-menu").classList.remove("active");
  });
});
