const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const revealItems = document.querySelectorAll("[data-reveal]");

const SCROLL_THRESHOLD = 48;

const googleForm = document.getElementById("booking-form");
const statusEl = document.getElementById("form-status");
const calendarTitle = document.querySelector("[data-calendar-title]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarPrevBtn = document.querySelector("[data-calendar-prev]");
const calendarNextBtn = document.querySelector("[data-calendar-next]");
const timeSlotList = document.querySelector("[data-time-slot-list]");
const slotFeedback = document.querySelector("[data-slot-feedback]");
const slotSummary = document.querySelector("[data-slot-summary]");
const dateInput = document.getElementById("booking-date");
const timeInput = document.getElementById("booking-time");
const serviceSelect = document.getElementById("service");
const dayBookingsSection = document.querySelector("[data-day-bookings]");
const dayBookingsList = dayBookingsSection?.querySelector(".day-bookings-list");
const dayBookingsEmpty = dayBookingsSection?.querySelector(".day-bookings-empty");

// Utiliser la configuration si disponible, sinon utiliser les valeurs par défaut
const GOOGLE_WEBAPP_URL = (typeof CONFIG !== "undefined" && CONFIG.googleAppsScript?.webAppUrl) 
  ? CONFIG.googleAppsScript.webAppUrl 
  : "https://script.google.com/macros/s/YOUR_WEB_APP_ID_HERE/usercopy";
const GOOGLE_RESERVATIONS_URL = GOOGLE_WEBAPP_URL;

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const BUSINESS_HOURS = (typeof CONFIG !== "undefined" && CONFIG.businessHours)
  ? CONFIG.businessHours
  : {
      0: null,
      1: { start: "09:00", end: "18:00" },
      2: { start: "09:00", end: "18:00" },
      3: { start: "09:00", end: "18:00" },
      4: { start: "09:00", end: "18:30" },
      5: { start: "09:00", end: "19:00" },
      6: { start: "09:00", end: "18:00" },
    };

const SLOT_DURATION_MINUTES = (typeof CONFIG !== "undefined" && CONFIG.booking?.slotDurationMinutes)
  ? CONFIG.booking.slotDurationMinutes
  : 30;
const MIN_LEAD_MINUTES = (typeof CONFIG !== "undefined" && CONFIG.booking?.minLeadMinutes)
  ? CONFIG.booking.minLeadMinutes
  : 60;
const bookingsByDate = new Map();

const today = new Date();
today.setHours(0, 0, 0, 0);

let selectedDate = dateInput && dateInput.value ? parseISODate(dateInput.value) : null;
if (selectedDate) {
  selectedDate.setHours(0, 0, 0, 0);
}

let calendarReference = selectedDate
  ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  : new Date(today.getFullYear(), today.getMonth(), 1);
calendarReference.setHours(0, 0, 0, 0);

let selectedDayElement = null;
let selectedSlotElement = null;

const FULL_WEEKDAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
startOfCurrentMonth.setHours(0, 0, 0, 0);
const maxMonthReference = new Date(today.getFullYear(), today.getMonth() + 2, 1);
maxMonthReference.setHours(0, 0, 0, 0);

function parseISODate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  const weekday = FULL_WEEKDAY_NAMES[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[date.getMonth()];
  return `${weekday} ${day} ${month} ${date.getFullYear()}`;
}

function formatTimeLabel(timeValue) {
  const [hours, minutes] = timeValue.split(":");
  return `${hours}h${minutes}`;
}

function formatTimeValue(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getLeadMinutes() {
  if (!serviceSelect) return MIN_LEAD_MINUTES;
  return serviceSelect.value === "Soin visage signature" ? 24 * 60 : MIN_LEAD_MINUTES;
}

function renderCalendar({ preserveSelection = true } = {}) {
  if (!calendarGrid || !calendarTitle) return;

  const month = calendarReference.getMonth();
  const year = calendarReference.getFullYear();
  calendarTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

  const previousTime = preserveSelection && timeInput ? timeInput.value : "";
  calendarGrid.innerHTML = "";
  selectedDayElement = null;

  WEEKDAY_LABELS.forEach((label) => {
    const weekdayCell = document.createElement("div");
    weekdayCell.className = "calendar-weekday";
    weekdayCell.textContent = label;
    calendarGrid.appendChild(weekdayCell);
  });

  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setHours(0, 0, 0, 0);
  const offset = (startOfMonth.getDay() + 6) % 7; // Monday-first calendar
  const totalCells = 42; // 6 weeks grid

  for (let index = 0; index < totalCells; index += 1) {
    const cellDate = new Date(startOfMonth);
    cellDate.setDate(startOfMonth.getDate() - offset + index);
    cellDate.setHours(0, 0, 0, 0);

    const isCurrentMonth = cellDate.getMonth() === month;
    const dayButton = createCalendarDay(cellDate, isCurrentMonth);

    if (selectedDate && isSameDay(cellDate, selectedDate) && !dayButton.disabled) {
      dayButton.classList.add("is-selected");
      selectedDayElement = dayButton;
    }

    calendarGrid.appendChild(dayButton);
  }

  updateCalendarNavState();
  renderTimeSlots(selectedDate, { preserveSelection, previousTime });
}

function createCalendarDay(cellDate, isCurrentMonth) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "calendar-day";
  button.dataset.date = formatISODate(cellDate);
  button.dataset.weekday = String(cellDate.getDay());
  button.setAttribute("aria-label", formatDisplayDate(cellDate));

  const content = document.createElement("span");
  content.className = "calendar-day-content";

  const number = document.createElement("span");
  number.className = "calendar-day-number";
  number.textContent = String(cellDate.getDate());

  content.appendChild(number);
  button.appendChild(content);

  const isPast = cellDate < today;
  const hoursConfig = BUSINESS_HOURS[cellDate.getDay()];

  if (!isCurrentMonth || !hoursConfig || isPast) {
    button.classList.add("is-muted");
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  }

  if (!hoursConfig) {
    button.classList.add("is-closed");
  }

  if (isSameDay(cellDate, today)) {
    button.classList.add("is-today");
  }

  if (!button.disabled) {
    button.addEventListener("click", () => handleDateSelection(cellDate, button));
  }

  decorateCalendarDay(button, cellDate);

  return button;
}

function handleDateSelection(date, element) {
  if (selectedDayElement) {
    selectedDayElement.classList.remove("is-selected");
  }
  selectedDate = new Date(date);
  selectedDayElement = element;
  selectedDayElement.classList.add("is-selected");

  if (dateInput) {
    dateInput.value = formatISODate(selectedDate);
  }

  renderTimeSlots(selectedDate, { preserveSelection: false });
}

function renderTimeSlots(date, { preserveSelection = true, previousTime = "" } = {}) {
  if (!timeSlotList || !slotFeedback || !slotSummary) return;

  timeSlotList.innerHTML = "";
  selectedSlotElement = null;

  if (!date) {
    clearSlotSelection();
    slotFeedback.textContent = "Sélectionnez d’abord une date.";
    slotSummary.textContent = "Aucun créneau sélectionné.";
    renderDayBookings(null);
    return;
  }

  const hoursConfig = BUSINESS_HOURS[date.getDay()];
  if (!hoursConfig) {
    clearSlotSelection();
    slotFeedback.textContent = "Le salon est fermé ce jour-là. Choisissez une autre date.";
    slotSummary.textContent = "Aucun créneau disponible.";
    renderDayBookings(date);
    return;
  }

  const dateKey = formatISODate(date);
  const reservationsForDay = getBookingsForDate(dateKey);
  const reservationsByTime = groupBookingsByTime(reservationsForDay);

  const [startHour, startMinute] = hoursConfig.start.split(":").map(Number);
  const [endHour, endMinute] = hoursConfig.end.split(":").map(Number);
  const startDateTime = new Date(date);
  startDateTime.setHours(startHour, startMinute, 0, 0);
  const endDateTime = new Date(date);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  const leadMinutes = getLeadMinutes();
  const minDateTime = new Date(Date.now() + leadMinutes * 60 * 1000);

  let availableSlots = 0;
  let restored = false;

  for (let cursor = new Date(startDateTime); cursor < endDateTime; cursor = new Date(cursor.getTime() + SLOT_DURATION_MINUTES * 60000)) {
    const timeValue = formatTimeValue(cursor);
    const slotButton = document.createElement("button");
    slotButton.type = "button";
    slotButton.className = "time-slot";
    slotButton.dataset.time = timeValue;
    slotButton.textContent = formatTimeLabel(timeValue);
    slotButton.setAttribute("aria-label", `${formatTimeLabel(timeValue)} le ${formatDisplayDate(date)}`);

    const bookingsForSlot = reservationsByTime.get(timeValue);
    const isBeforeLead = cursor < minDateTime;

    if (bookingsForSlot && bookingsForSlot.length) {
      slotButton.disabled = true;
      slotButton.classList.add("is-reserved");
      slotButton.setAttribute("aria-disabled", "true");
      slotButton.title = bookingsForSlot
        .map((booking) => {
          const label = booking.service ? `• ${booking.service}` : "• Réservé";
          return `${formatTimeLabel(booking.time)} ${label}`;
        })
        .join("\n");
    } else if (isBeforeLead) {
      slotButton.disabled = true;
      slotButton.classList.add("is-disabled");
      slotButton.setAttribute("aria-disabled", "true");
    } else {
      slotButton.addEventListener("click", () => handleSlotSelection(timeValue, slotButton));
      availableSlots += 1;
      if (preserveSelection && previousTime && previousTime === timeValue) {
        handleSlotSelection(timeValue, slotButton);
        restored = true;
      }
    }

    timeSlotList.appendChild(slotButton);
  }

  if (!availableSlots) {
    clearSlotSelection();
    slotSummary.textContent = `Tous les horaires du ${formatDisplayDate(date)} sont indisponibles.`;
    slotFeedback.textContent = reservationsForDay.length
      ? "Tous les créneaux sont déjà réservés pour cette date."
      : "Aucun créneau disponible sur cette journée.";
  } else if (!restored) {
    clearSlotSelection();
    slotSummary.textContent = `Date sélectionnée : ${formatDisplayDate(date)}. Choisissez un horaire.`;
    slotFeedback.textContent = "Choisissez un horaire parmi les créneaux proposés.";
  } else {
    slotFeedback.textContent = "Créneau conservé pour cette date.";
  }

  renderDayBookings(date);
}

function handleSlotSelection(timeValue, element) {
  if (!selectedDate) return;
  if (selectedSlotElement && selectedSlotElement !== element) {
    selectedSlotElement.classList.remove("is-selected");
  }
  selectedSlotElement = element;
  selectedSlotElement.classList.add("is-selected");

  if (timeInput) {
    timeInput.value = timeValue;
  }

  if (slotSummary) {
    slotSummary.textContent = `Créneau sélectionné : ${formatDisplayDate(selectedDate)} — ${formatTimeLabel(timeValue)}.`;
  }

  if (slotFeedback) {
    slotFeedback.textContent = "Nous vous confirmerons ce créneau très vite.";
  }
}

function clearSlotSelection() {
  if (selectedSlotElement) {
    selectedSlotElement.classList.remove("is-selected");
  }
  selectedSlotElement = null;
  if (timeInput) {
    timeInput.value = "";
  }
}

function changeMonth(offset) {
  const nextReference = new Date(calendarReference.getFullYear(), calendarReference.getMonth() + offset, 1);
  nextReference.setHours(0, 0, 0, 0);

  if (offset < 0 && nextReference < startOfCurrentMonth) {
    return;
  }

  if (offset > 0 && nextReference > maxMonthReference) {
    return;
  }

  calendarReference = nextReference;
  renderCalendar();
}

function updateCalendarNavState() {
  if (calendarPrevBtn) {
    const isDisabled = calendarReference.getTime() <= startOfCurrentMonth.getTime();
    calendarPrevBtn.disabled = isDisabled;
  }
  if (calendarNextBtn) {
    const isDisabled = calendarReference.getTime() >= maxMonthReference.getTime();
    calendarNextBtn.disabled = isDisabled;
  }
}

function resetCalendarState() {
  selectedDate = null;
  clearSlotSelection();
  if (dateInput) {
    dateInput.value = "";
  }
  calendarReference = new Date(today.getFullYear(), today.getMonth(), 1);
  calendarReference.setHours(0, 0, 0, 0);
  renderCalendar({ preserveSelection: false });
  if (slotFeedback) {
    slotFeedback.textContent = "Sélectionnez d’abord une date.";
  }
  if (slotSummary) {
    slotSummary.textContent = "Aucun créneau sélectionné.";
  }
}

function getBookingsForDate(dateKey) {
  return bookingsByDate.get(dateKey) ?? [];
}

function groupBookingsByTime(bookings) {
  const map = new Map();
  bookings.forEach((booking) => {
    const key = booking.time || "";
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(booking);
  });
  return map;
}

function decorateCalendarDay(button, date) {
  if (!button || !date) return;
  const dateKey = formatISODate(date);
  const bookings = getBookingsForDate(dateKey);
  const hasBookings = bookings.length > 0;

  button.classList.toggle("has-bookings", hasBookings);

  const content = button.querySelector(".calendar-day-content");
  if (!content) {
    return;
  }

  let summary = content.querySelector(".calendar-day-summary");
  if (!summary) {
    summary = document.createElement("span");
    summary.className = "calendar-day-summary";
    content.appendChild(summary);
  }

  if (!hasBookings) {
    summary.textContent = "";
    summary.hidden = true;
    return;
  }

  const topBooking = bookings[0];
  const label = topBooking?.service || "Réservé";
  summary.textContent = bookings.length > 1 ? `${bookings.length} réservations` : label;
  summary.hidden = false;
}

function renderDayBookings(date) {
  if (!dayBookingsSection || !dayBookingsEmpty || !dayBookingsList) {
    return;
  }

  if (!date) {
    dayBookingsEmpty.textContent = "Sélectionnez une date pour voir les réservations.";
    dayBookingsEmpty.hidden = false;
    dayBookingsList.hidden = true;
    dayBookingsList.innerHTML = "";
    return;
  }

  const dateKey = formatISODate(date);
  const bookings = [...getBookingsForDate(dateKey)].sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  if (!bookings.length) {
    dayBookingsEmpty.textContent = "Aucune réservation enregistrée.";
    dayBookingsEmpty.hidden = false;
    dayBookingsList.hidden = true;
    dayBookingsList.innerHTML = "";
    return;
  }

  dayBookingsEmpty.hidden = true;
  dayBookingsList.hidden = false;
  dayBookingsList.innerHTML = "";

  bookings.forEach((booking) => {
    dayBookingsList.appendChild(createBookingListItem(booking));
  });
}

function createBookingListItem(booking) {
  const item = document.createElement("li");
  item.className = "day-booking-item";

  const head = document.createElement("div");
  head.className = "booking-item-head";

  const time = document.createElement("span");
  time.className = "booking-item-time";
  time.textContent = booking.time ? formatTimeLabel(booking.time) : "--:--";

  const service = document.createElement("span");
  service.className = "booking-item-service";
  service.textContent = booking.service || "Rituel";

  head.append(time, service);
  item.appendChild(head);

  const meta = document.createElement("div");
  meta.className = "booking-item-meta";

  if (booking.email) {
    const email = document.createElement("span");
    email.textContent = booking.email;
    meta.appendChild(email);
  }

  if (booking.instagram) {
    const instagram = document.createElement("span");
    instagram.textContent = booking.instagram;
    meta.appendChild(instagram);
  }

  if (meta.childElementCount) {
    item.appendChild(meta);
  }

  if (booking.details) {
    const notes = document.createElement("p");
    notes.className = "booking-item-notes";
    notes.textContent = booking.details;
    item.appendChild(notes);
  }

  return item;
}

function indexBookings(entries) {
  bookingsByDate.clear();
  if (!Array.isArray(entries)) {
    return;
  }

  entries.forEach((entry) => {
    const dateKey = normalizeDateField(entry.date ?? entry.Date ?? entry.jour);
    if (!dateKey) return;

    const record = {
      date: dateKey,
      time: normalizeTimeField(entry.time ?? entry.heure ?? entry.slot),
      service: entry.service ?? entry.prestation ?? "",
      email: entry.email ?? entry.mail ?? "",
      instagram: entry.instagram ?? entry.handle ?? "",
      details: entry.details ?? entry.notes ?? entry.commentaire ?? "",
    };

    if (!bookingsByDate.has(dateKey)) {
      bookingsByDate.set(dateKey, []);
    }
    bookingsByDate.get(dateKey).push(record);
  });

  bookingsByDate.forEach((list, key) => {
    bookingsByDate.set(
      key,
      list
        .filter((booking) => booking.time)
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
    );
  });
}

function normalizeDateField(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const parsed = parseISODate(value);
  return parsed ? formatISODate(parsed) : "";
}

function normalizeTimeField(value) {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const match = value.match(/(\d{1,2})[:h](\d{2})/i);
  if (!match) return "";
  const hours = String(Math.min(Number(match[1]), 23)).padStart(2, "0");
  const minutes = String(Math.min(Number(match[2]), 59)).padStart(2, "0");
  return `${hours}:${minutes}`;
}

async function fetchBookingsAndRefresh({ silent = false } = {}) {
  if (!GOOGLE_RESERVATIONS_URL || GOOGLE_RESERVATIONS_URL.includes("YOUR_WEB_APP_ID_HERE")) {
    return;
  }

  try {
    // Charge les réservations depuis Google Sheets via l'API CSV
    const spreadsheetId = (typeof CONFIG !== "undefined" && CONFIG.googleAppsScript?.spreadsheetId)
      ? CONFIG.googleAppsScript.spreadsheetId
      : null;

    if (!spreadsheetId) {
      console.log("Pas d'ID de feuille configuré");
      renderCalendar({ preserveSelection: true });
      return;
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const csv = await response.text();
    const lines = csv.trim().split("\n");
    
    console.log("CSV chargé:", lines.length, "lignes");
    
    // Parse CSV (skip header)
    const bookings = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Parse CSV en gérant les guillemets
      const values = [];
      let current = "";
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ""));
      
      const [date, time, email, instagram, service, details] = values;
      if (date && time) {
        bookings.push({ date, time, email, instagram, service, details });
        console.log("Réservation chargée:", date, time);
      }
    }

    // Index les réservations correctement
    indexBookings(bookings);
    renderCalendar({ preserveSelection: true });
  } catch (error) {
    console.error("Erreur lors du chargement des réservations", error);
    // Continue sans erreur - les réservations peuvent être vues dans Google Sheets
    renderCalendar({ preserveSelection: true });
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.15,
  }
);

revealItems.forEach((element) => {
  const index = Number(element.dataset.index ?? element.dataset.reveal ?? 0);
  element.style.setProperty("--reveal-index", index);
  observer.observe(element);
});

const sectionsById = Array.from(document.querySelectorAll("section[id]"));

function updateNavbarState() {
  if (!navbar) return;
  const shouldCompact = window.scrollY > SCROLL_THRESHOLD;
  navbar.classList.toggle("is-scrolled", shouldCompact);
}

function updateActiveLink() {
  const scrollPosition = window.scrollY + 160;
  let currentId = null;

  for (let i = sectionsById.length - 1; i >= 0; i -= 1) {
    const section = sectionsById[i];
    if (scrollPosition >= section.offsetTop) {
      currentId = section.id;
      break;
    }
  }

  navLinks.forEach((link) => {
    const isActive = currentId && link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
}

function handleNavClick(event) {
  const link = event.currentTarget;
  const targetId = link.getAttribute("href")?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;
  if (!target) return;

  event.preventDefault();

  const offset = 100;
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", handleNavClick);
});

window.addEventListener("scroll", () => {
  updateNavbarState();
  updateActiveLink();
});

updateNavbarState();
updateActiveLink();

if (calendarPrevBtn) {
  calendarPrevBtn.addEventListener("click", () => changeMonth(-1));
}

if (calendarNextBtn) {
  calendarNextBtn.addEventListener("click", () => changeMonth(1));
}

if (serviceSelect) {
  serviceSelect.addEventListener("change", () => {
    if (selectedDate) {
      renderTimeSlots(selectedDate, { preserveSelection: false });
    }
  });
}

if (calendarGrid && calendarTitle) {
  renderCalendar({ preserveSelection: true });
  fetchBookingsAndRefresh({ silent: true });
}

if (googleForm && statusEl) {
  googleForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!dateInput?.value || !timeInput?.value) {
      setStatus("Sélectionnez d’abord une date et un horaire dans le calendrier.", "is-error");
      return;
    }

    if (GOOGLE_WEBAPP_URL.includes("YOUR_WEB_APP_ID_HERE")) {
      setStatus("Configurez l'URL Google Apps Script dans main.js pour activer l'envoi.", "is-error");
      return;
    }

    setStatus("Envoi en cours…", "is-loading");

    try {
      const formData = new FormData(googleForm);
      const jsonData = {
        date: formData.get("date"),
        time: formData.get("time"),
        email: formData.get("email"),
        instagram: formData.get("instagram"),
        service: formData.get("service"),
        details: formData.get("details")
      };

      const response = await fetch(GOOGLE_WEBAPP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData),
        mode: "no-cors"
      });

      // Avec mode: "no-cors", on ne peut pas lire la réponse, mais on sait que la requête a été envoyée
      googleForm.reset();
      resetCalendarState();
      setStatus("Merci ! Votre réservation a été enregistrée. Nous vous revenons sous 24h.", "is-success");
      fetchBookingsAndRefresh({ silent: true });
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setStatus("Impossible d'envoyer votre demande pour le moment. Merci de réessayer.", "is-error");
    }
  });
}

function setStatus(message, state) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = "form-status";
  if (state) {
    statusEl.classList.add(state);
  }
}