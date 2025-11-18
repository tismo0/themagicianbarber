/**
 * Google Apps Script pour The Magician
 * À copier-coller dans l'éditeur Google Apps Script
 * https://script.google.com/home
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || "booking";
    
    if (action === "booking") {
      return handleBooking(data);
    } else if (action === "blockage") {
      return handleBlockage(data);
    } else if (action === "announcement") {
      return handleAnnouncement(data);
    } else {
      return createErrorResponse("Action inconnue");
    }
  } catch(error) {
    return createErrorResponse(error.toString());
  }
}

function handleBooking(data) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Réservations") || spreadsheet.getActiveSheet();
    
    sheet.appendRow([
      data.date || "",
      data.time || "",
      data.prenom || "",
      data.nom || "",
      data.email || "",
      data.instagram || "",
      data.service || "",
      data.coiffeur || "",
      data.notes || ""
    ]);
    
    return createSuccessResponse("Réservation enregistrée avec succès");
  } catch(error) {
    return createErrorResponse(error.toString());
  }
}

function handleBlockage(data) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName("Blocages");
    
    // Créer l'onglet s'il n'existe pas
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Blocages");
      sheet.appendRow(["type", "date", "time", "reason"]);
    }
    
    sheet.appendRow([
      data.type || "",
      data.date || "",
      data.time || "",
      data.reason || ""
    ]);
    
    return createSuccessResponse("Blocage enregistré avec succès");
  } catch(error) {
    return createErrorResponse(error.toString());
  }
}

function handleAnnouncement(data) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName("Annonces");
    
    // Créer l'onglet s'il n'existe pas
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Annonces");
      sheet.appendRow(["id", "text", "type"]);
    }
    
    const id = data.id || Date.now().toString();
    sheet.appendRow([
      id,
      data.text || "",
      data.type || "info"
    ]);
    
    return createSuccessResponse("Annonce enregistrée avec succès");
  } catch(error) {
    return createErrorResponse(error.toString());
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Réservations") || spreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    const bookings = data.slice(1).map(row => ({
      date: row[0],
      time: row[1],
      prenom: row[2],
      nom: row[3],
      email: row[4],
      instagram: row[5],
      service: row[6],
      coiffeur: row[7],
      notes: row[8]
    }));
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      bookings: bookings
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch(error) {
    return createErrorResponse(error.toString());
  }
}

// Fonctions utilitaires
function createSuccessResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: message
  }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function createErrorResponse(error) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: error
  }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
