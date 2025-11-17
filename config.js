/**
 * Configuration du Salon The Magician
 * Modifiez les valeurs selon vos besoins
 */

const CONFIG = {
  // Informations du salon
  salon: {
    name: "The Magician",
    tagline: "Salon de coiffure & art capillaire",
    address: "Rue du Palais 93, 4800 Verviers",
    phone: "+3287447753",
    email: "hello@themagician.be",
    instagram: "@the_magician_barber",
    website: "https://themagician.be",
  },

  // Horaires d'ouverture (0 = Dimanche, 6 = Samedi)
  businessHours: {
    0: null, // Dimanche fermé
    1: { start: "09:00", end: "18:00" }, // Lundi
    2: { start: "09:00", end: "18:00" }, // Mardi
    3: { start: "09:00", end: "18:00" }, // Mercredi
    4: { start: "09:00", end: "18:30" }, // Jeudi
    5: { start: "09:00", end: "19:00" }, // Vendredi
    6: { start: "09:00", end: "18:00" }, // Samedi
  },

  // Services et tarifs
  services: [
    { id: "coupe-tondeuse", name: "Coupe tondeuse", price: 13, duration: 20 },
    { id: "coupe-degrade", name: "Coupe dégradé", price: 18, duration: 30 },
    { id: "coupe-enfant", name: "Coupe enfant", price: 15, duration: 25 },
    { id: "coupe-shampoing", name: "Coupe & shampoing", price: 20, duration: 35 },
    { id: "barbe-tondeuse", name: "Barbe tondeuse", price: 5, duration: 10 },
    { id: "barbe-entretien", name: "Barbe entretien", price: 12, duration: 20 },
    { id: "barbe-longue", name: "Barbe longue", price: 15, duration: 25 },
    { id: "rasage-ancien", name: "Rasage à l'ancienne", price: 15, duration: 30 },
    { id: "coupe-barbe", name: "Coupe & barbe", price: 28, duration: 50 },
    { id: "soin-visage", name: "Soin visage signature", price: 40, duration: 45, minLeadHours: 24 },
  ],

  // Équipe
  team: [
    {
      name: "Élodie",
      title: "Color Enchanteresse",
      specialty: "Experte en balayage soleil et corrections de couleurs",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Malik",
      title: "Tailleur d'ombres",
      specialty: "Spécialiste des coupes graphiques et barbes sculptées",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Lucia",
      title: "Architecte du volume",
      specialty: "Maîtrise les coupes transformation et brushings",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    },
  ],

  // Réservation
  booking: {
    slotDurationMinutes: 30,
    minLeadMinutes: 60, // Délai minimum avant réservation
    maxMonthsAhead: 3, // Réservation jusqu'à 3 mois à l'avance
    enableNotifications: true,
  },

  // Google Apps Script (à configurer)
  googleAppsScript: {
    webAppUrl: "https://script.google.com/macros/s/AKfycbxVpXr6w5A39hJ0n4b2qmBhvlFLBuzIger6fcL9ygQdcFGcEa6Fqp-CS9tcQ1sEtloLjQ/exec",
    enabled: true, // Mettre à true une fois configuré
  },

  // Intégrations (optionnel)
  integrations: {
    googleAnalytics: {
      enabled: false,
      trackingId: "G-XXXXXXXXXX",
    },
    googleMaps: {
      enabled: false,
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
      latitude: 50.6292,
      longitude: 5.8849,
    },
    booksy: {
      enabled: false,
      businessId: "YOUR_BOOKSY_ID",
    },
  },

  // Couleurs (optionnel, peut être modifié via CSS)
  colors: {
    primary: "#d4af37",
    primaryDark: "#b8941f",
    dark: "#1a1a1a",
    light: "#fafaf8",
    white: "#ffffff",
  },

  // Messages
  messages: {
    bookingSuccess: "Merci ! Votre réservation a été confirmée. Nous vous revenons sous 24h.",
    bookingError: "Une erreur s'est produite. Veuillez réessayer.",
    selectDate: "Sélectionnez d'abord une date.",
    selectTime: "Sélectionnez un horaire.",
    noAvailability: "Aucun créneau disponible pour cette date.",
    salonClosed: "Le salon est fermé ce jour-là.",
  },
};

// Export pour utilisation dans main.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
