# 🚀 Guide d'Installation Complet

## The Magician – Salon de Coiffure Premium

Ce guide vous aidera à configurer et déployer le site de réservation en ligne.

---

## 📋 Prérequis

- Un compte Google (pour Google Sheets + Apps Script)
- Un domaine (optionnel, mais recommandé)
- Un hébergement web (Vercel, Netlify, ou autre)
- Connaissances basiques en HTML/CSS/JavaScript

---

## 🔧 Configuration Étape par Étape

### Étape 1 : Préparer Google Sheets

#### 1.1 Créer une feuille Google Sheets

1. Allez sur [sheets.google.com](https://sheets.google.com)
2. Cliquez sur **+ Créer** → **Feuille de calcul**
3. Nommez-la : **"The Magician - Réservations"**
4. Créez les colonnes suivantes dans la première ligne :

| date | time | email | instagram | service | details |
|------|------|-------|-----------|---------|---------|
| (vide) | (vide) | (vide) | (vide) | (vide) | (vide) |

**Exemple de données** :
```
2025-01-20 | 14:00 | client@email.com | @client_insta | Coupe dégradé | Transformation complète
2025-01-20 | 14:30 | autre@email.com | @autre_insta | Soin visage signature | Besoin de détente
```

#### 1.2 Créer un Google Apps Script

1. Dans votre feuille Sheets, allez à **Outils → Éditeur Apps Script**
2. Une nouvelle fenêtre s'ouvre
3. Supprimez le code par défaut
4. Collez ce code :

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Convertir en JSON (ignorer la première ligne d'en-têtes)
  const headers = data[0];
  const result = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = e.parameter;
  
  // Ajouter la nouvelle réservation
  sheet.appendRow([
    data.date,
    data.time,
    data.email,
    data.instagram,
    data.service,
    data.details
  ]);
  
  // Envoyer un email de confirmation
  try {
    GmailApp.sendEmail(
      data.email,
      "Réservation confirmée - The Magician",
      `Bonjour,\n\nVotre réservation a été confirmée !\n\n` +
      `Date : ${data.date}\n` +
      `Heure : ${data.time}\n` +
      `Service : ${data.service}\n\n` +
      `Nous vous remercions de votre confiance.\n\n` +
      `The Magician\n` +
      `Rue du Palais 93, 4800 Verviers\n` +
      `087 44 77 53`
    );
  } catch (error) {
    console.error("Erreur d'envoi email:", error);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    message: "Réservation confirmée ! Nous vous revenons sous 24h."
  })).setMimeType(ContentService.MimeType.JSON);
}
```

5. Cliquez sur **Enregistrer** (icône disquette)
6. Nommez le projet : **"The Magician Booking"**
7. Cliquez sur **Exécuter** (bouton ▶)
8. Acceptez les permissions demandées

#### 1.3 Déployer l'Apps Script

1. Cliquez sur **Déployer** (bouton en haut à droite)
2. Sélectionnez **Nouveau déploiement**
3. Cliquez sur l'icône ⚙ (Sélectionner le type)
4. Choisissez **Application web**
5. Remplissez les champs :
   - **Exécuter en tant que** : Votre compte Google
   - **Accès** : **Tout le monde**
6. Cliquez sur **Déployer**
7. Copiez l'URL fournie (ressemble à : `https://script.google.com/macros/s/AKfycb...`)

---

### Étape 2 : Configurer le Site

#### 2.1 Mettre à jour config.js

Ouvrez le fichier `config.js` et modifiez :

```javascript
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

  // ... autres configurations ...

  // Google Apps Script (IMPORTANT)
  googleAppsScript: {
    webAppUrl: "VOTRE_URL_COPIÉE_ICI", // Collez l'URL du déploiement
    enabled: true, // Mettre à true
  },
};
```

#### 2.2 Personnaliser les horaires

Dans `config.js`, modifiez `businessHours` :

```javascript
businessHours: {
  0: null,                           // Dimanche fermé
  1: { start: "09:00", end: "18:00" }, // Lundi
  2: { start: "09:00", end: "18:00" }, // Mardi
  3: { start: "09:00", end: "18:00" }, // Mercredi
  4: { start: "09:00", end: "18:30" }, // Jeudi (fermeture plus tard)
  5: { start: "09:00", end: "19:00" }, // Vendredi (fermeture encore plus tard)
  6: { start: "09:00", end: "18:00" }, // Samedi
},
```

#### 2.3 Ajouter vos services

Dans `config.js`, modifiez le tableau `services` :

```javascript
services: [
  { id: "coupe-tondeuse", name: "Coupe tondeuse", price: 13, duration: 20 },
  { id: "coupe-degrade", name: "Coupe dégradé", price: 18, duration: 30 },
  // Ajoutez vos services...
],
```

---

### Étape 3 : Tester Localement

#### 3.1 Lancer un serveur local

**Avec Python 3** :
```bash
python -m http.server 8000
```

**Avec Node.js** :
```bash
npx http-server
```

**Avec Live Server (VS Code)** :
- Installez l'extension "Live Server"
- Clic droit sur `index.html` → "Open with Live Server"

#### 3.2 Tester le formulaire

1. Ouvrez `http://localhost:8000`
2. Naviguez jusqu'à la section "Réservation"
3. Sélectionnez une date et un horaire
4. Remplissez le formulaire
5. Cliquez sur "Valider la réservation"
6. Vérifiez que la réservation apparaît dans votre Google Sheets

---

### Étape 4 : Déployer en Ligne

#### Option A : Vercel (Recommandé)

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```
3. Dans le dossier du projet :
   ```bash
   vercel
   ```
4. Suivez les instructions
5. Votre site est en ligne !

#### Option B : Netlify

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Connectez votre repo GitHub (ou uploadez les fichiers)
3. Configurez le build (pas de build nécessaire pour ce projet)
4. Déployez !

#### Option C : Hébergement classique (OVH, Hostinger, etc.)

1. Uploadez les fichiers via FTP
2. Configurez le domaine
3. Activez HTTPS (Let's Encrypt)

---

## 📱 Tester sur Mobile

### Avec Chrome DevTools

1. Ouvrez le site dans Chrome
2. Appuyez sur **F12** ou **Ctrl+Shift+I**
3. Cliquez sur l'icône mobile (en haut à gauche)
4. Testez les différentes résolutions

### Avec votre téléphone

1. Assurez-vous que le site est en ligne
2. Ouvrez l'URL sur votre téléphone
3. Testez la navigation, le formulaire, etc.

---

## 🔍 Vérifier la Configuration

### Checklist

- [ ] Google Sheets créée avec les bonnes colonnes
- [ ] Google Apps Script déployé
- [ ] URL Apps Script copiée dans `config.js`
- [ ] `config.js` modifié avec vos informations
- [ ] Horaires corrects
- [ ] Services à jour
- [ ] Équipe configurée
- [ ] Site testé localement
- [ ] Formulaire de réservation fonctionne
- [ ] Réservations apparaissent dans Google Sheets
- [ ] Site déployé en ligne
- [ ] Domaine configuré (optionnel)
- [ ] HTTPS activé
- [ ] Google Analytics configuré (optionnel)

---

## 🐛 Dépannage

### Le formulaire ne fonctionne pas

1. Vérifiez que l'URL Apps Script est correcte dans `config.js`
2. Vérifiez que `googleAppsScript.enabled` est `true`
3. Ouvrez la console (F12) et cherchez les erreurs
4. Testez l'URL directement dans le navigateur

### Les réservations n'apparaissent pas dans Sheets

1. Vérifiez que le Apps Script a les bonnes permissions
2. Vérifiez que les colonnes de Sheets correspondent au code
3. Vérifiez que le Apps Script a été redéployé après les modifications

### Le calendrier ne charge pas

1. Vérifiez que `main.js` est chargé (F12 → Console)
2. Vérifiez que `config.js` est chargé avant `main.js`
3. Vérifiez qu'il n'y a pas d'erreurs JavaScript

### Les emails de confirmation ne sont pas envoyés

1. Vérifiez que le compte Google a accès à Gmail
2. Vérifiez que le code `doPost` inclut la fonction d'envoi d'email
3. Vérifiez les logs du Apps Script (Exécutions)

---

## 🎨 Personnalisation Avancée

### Changer les couleurs

Modifiez les variables CSS dans `style.css` :

```css
:root {
  --accent: #d4af37; /* Couleur principale (doré) */
  --accent-dark: #b8941f; /* Couleur foncée */
  --ink: #1a1a1a; /* Couleur du texte (noir) */
  --bg: #fafaf8; /* Couleur de fond */
  --bg-alt: #ffffff; /* Couleur de fond alternative (blanc) */
}
```

### Ajouter des images

1. Remplacez les URLs Unsplash par vos images
2. Optimisez les images (WebP, compression)
3. Utilisez des dimensions appropriées

### Modifier les textes

Modifiez directement dans `index.html` les sections que vous voulez changer.

---

## 📊 Suivi des Réservations

### Via Google Sheets

1. Ouvrez votre feuille Sheets
2. Toutes les réservations y sont enregistrées
3. Vous pouvez créer des graphiques, des filtres, etc.

### Via Google Forms (optionnel)

Vous pouvez aussi créer un Google Form pour les réservations, mais le système actuel est plus flexible.

---

## 📞 Support

Si vous avez des questions :

1. Consultez le `README.md`
2. Vérifiez les logs du navigateur (F12 → Console)
3. Vérifiez les logs du Apps Script (Exécutions)
4. Contactez le support de votre hébergeur

---

## 🎉 Félicitations !

Votre site de réservation est maintenant en ligne et fonctionnel !

**Prochaines étapes** :
- Ajouter Google Analytics
- Configurer Google Search Console
- Optimiser le SEO
- Promouvoir le site sur les réseaux sociaux
- Collecter les avis clients

---

**Dernière mise à jour** : Novembre 2025
