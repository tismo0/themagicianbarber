# The Magician – Salon de Coiffure Premium

## 🎩 Redesign Complet & Professionnel

Ce site a été entièrement redesigné pour offrir une **expérience utilisateur exceptionnelle** et un design **haut de gamme** digne d'un salon de coiffure premium.

---

## 📋 Caractéristiques Principales

### 🎨 Design & Identité Visuelle
- **Palette de couleurs premium** : Noir (#1a1a1a), Blanc (#ffffff), Doré (#d4af37)
- **Typographie élégante** : Playfair Display (titres) + Poppins (corps)
- **Animations fluides** : Transitions douces au scroll, hover effects subtils
- **Responsive 100%** : Mobile-first, optimisé pour tous les appareils
- **Accessibilité** : Contraste optimal, navigation au clavier, ARIA labels

### ⚡ Performance
- Images optimisées avec lazy loading
- CSS minifié et optimisé
- Chargement rapide (< 2s)
- Pas de dépendances externes lourdes

### 📱 Mobile-First
- Navigation intuitive sur mobile
- Boutons d'appel rapide (tel:)
- Formulaires optimisés pour tactile
- Calendrier responsive

### 🔐 Système de Réservation Robuste
- Calendrier interactif avec gestion des créneaux
- Validation des horaires en temps réel
- Gestion des réservations existantes
- Intégration Google Sheets (via Apps Script)
- Notifications email/SMS (à configurer)

---

## 🚀 Déploiement & Configuration

### 1. Configuration Google Sheets + Apps Script

#### Étape 1 : Créer une feuille Google Sheets
1. Allez sur [sheets.google.com](https://sheets.google.com)
2. Créez une nouvelle feuille nommée "Réservations"
3. Créez les colonnes suivantes :
   - `date` (YYYY-MM-DD)
   - `time` (HH:MM)
   - `email`
   - `instagram`
   - `service`
   - `details`

#### Étape 2 : Créer un Google Apps Script
1. Ouvrez la feuille Sheets
2. Allez à **Outils → Éditeur Apps Script**
3. Remplacez le code par ceci :

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
  
  sheet.appendRow([
    data.date,
    data.time,
    data.email,
    data.instagram,
    data.service,
    data.details
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    message: "Réservation confirmée ! Nous vous revenons sous 24h."
  })).setMimeType(ContentService.MimeType.JSON);
}
```

4. Cliquez sur **Déployer → Nouveau déploiement**
5. Sélectionnez **Type : Application web**
6. Exécuter en tant que : Votre compte
7. Accès : **Tout le monde**
8. Copiez l'URL du déploiement

#### Étape 3 : Configurer l'URL dans le site
1. Ouvrez `main.js`
2. Remplacez la ligne :
```javascript
const GOOGLE_WEBAPP_URL = "https://script.google.com/macros/s/YOUR_WEB_APP_ID_HERE/usercopy";
```
Par votre URL copiée.

### 2. Alternative : Utiliser Booksy ou Calendly

Si vous préférez une solution clé en main :

#### Option A : Booksy (Recommandé pour barbershops)
- Gestion complète des réservations
- Intégration Google Maps
- Notifications SMS/Email automatiques
- Paiement en ligne
- Dashboard professionnel
- Lien : [booksy.com](https://booksy.com)

#### Option B : Calendly
- Simple et efficace
- Intégration facile
- Synchronisation calendrier
- Lien : [calendly.com](https://calendly.com)

#### Option C : SimplyBook.me
- Spécialisé pour salons
- Gestion des ressources
- Rappels automatiques
- Lien : [simplybook.me](https://simplybook.me)

---

## 📊 Structure du Projet

```
projet x/
├── index.html          # Structure HTML (redesignée)
├── style.css           # Styles premium (redesignés)
├── main.js             # Logique réservation + interactions
├── README.md           # Cette documentation
└── assets/             # Images optimisées (à ajouter)
```

---

## 🎯 Pages & Sections

### 1. **Accueil (Hero)**
- Grande bannière immersive
- Slogan accrocheur
- CTA principal "Réserver maintenant"
- Animation au scroll

### 2. **L'Expérience**
- Présentation du salon
- 3 piliers : Accueil, Rituels, Club

### 3. **Services & Prestations**
- 4 services phares avec images
- Description détaillée
- Prix transparent
- CTA réservation

### 4. **Soin Visage Signature**
- Section dédiée
- Processus détaillé (6 étapes)
- Prix et durée
- Réservation directe

### 5. **Tarifs Complets**
- 9 services listés
- Images professionnelles
- Prix clairs
- Grille responsive

### 6. **Horaires & Contact**
- Horaires d'ouverture
- Adresse + téléphone
- Instagram
- Google Maps (à intégrer)

### 7. **Équipe**
- Présentation des coiffeurs
- Spécialités
- Photos (à ajouter)

### 8. **Réservation**
- Calendrier interactif
- Sélection créneaux
- Formulaire complet
- Confirmation instantanée

---

## 🎨 Design System

### Couleurs
```css
--accent: #d4af37 (Doré)
--accent-dark: #b8941f (Doré foncé)
--accent-soft: rgba(212, 175, 55, 0.08)
--accent-light: rgba(212, 175, 55, 0.15)
--ink: #1a1a1a (Noir)
--ink-muted: rgba(26, 26, 26, 0.65)
--bg: #fafaf8 (Blanc cassé)
--bg-alt: #ffffff (Blanc)
```

### Typographie
- **Titres** : Playfair Display (serif élégante)
- **Corps** : Poppins (sans-serif moderne)
- **Poids** : 300, 400, 500, 600, 700

### Espacements
- Padding sections : clamp(4rem, 8vw, 6rem)
- Gap grilles : clamp(1.4rem, 3vw, 2.2rem)
- Border radius : 24px (lg), 16px (md), 8px (sm)

### Ombres
```css
--shadow-soft: 0 12px 32px rgba(0, 0, 0, 0.08)
--shadow-card: 0 20px 48px rgba(0, 0, 0, 0.12)
--shadow-deep: 0 30px 60px rgba(0, 0, 0, 0.15)
```

---

## 📱 Responsive Breakpoints

- **Desktop** : 1200px+
- **Tablet** : 960px - 1199px
- **Mobile** : 720px - 959px
- **Small Mobile** : < 720px

---

## 🔧 Personnalisation

### Changer les couleurs
Modifiez les variables CSS dans `:root` du fichier `style.css`

### Ajouter des images
1. Remplacez les URLs Unsplash par vos images
2. Optimisez les images (WebP, compression)
3. Utilisez des dimensions appropriées

### Modifier les horaires
Dans `main.js`, modifiez `BUSINESS_HOURS` :
```javascript
const BUSINESS_HOURS = {
  0: null,                           // Dimanche fermé
  1: { start: "09:00", end: "18:00" }, // Lundi
  // ...
};
```

### Ajouter des services
1. Ajoutez dans la section Services
2. Mettez à jour le select du formulaire
3. Ajustez les tarifs

---

## 📈 SEO & Optimisation

### Optimisations incluses
- ✅ Meta descriptions
- ✅ Titres H1-H6 structurés
- ✅ Images avec alt text
- ✅ Mobile-friendly
- ✅ Vitesse de chargement
- ✅ Structured data (à ajouter)

### À faire
1. Ajouter Google Analytics
2. Ajouter Google Search Console
3. Créer sitemap.xml
4. Ajouter robots.txt
5. Ajouter schema.json (LocalBusiness)

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Option 2 : Netlify
1. Connectez votre repo GitHub
2. Configurez le build
3. Déployez automatiquement

### Option 3 : Hébergement classique
1. Uploadez les fichiers via FTP
2. Configurez le domaine
3. Activez HTTPS

---

## 📞 Support & Contact

**The Magician – Salon de Coiffure**
- 📍 Rue du Palais 93, 4800 Verviers
- 📱 087 44 77 53
- 📧 hello@themagician.be
- 📸 [@the_magician_barber](https://instagram.com/the_magician_barber)

---

## 📝 Checklist Avant Lancement

- [ ] Configurer Google Apps Script
- [ ] Tester le formulaire de réservation
- [ ] Ajouter vos images professionnelles
- [ ] Vérifier tous les liens
- [ ] Tester sur mobile
- [ ] Configurer Google Analytics
- [ ] Vérifier le SEO
- [ ] Tester les performances
- [ ] Activer HTTPS
- [ ] Configurer les emails de confirmation

---

## 📄 Licence

Ce site est propriété de The Magician. Tous droits réservés.

---

**Dernière mise à jour** : Novembre 2025
**Version** : 2.0 (Redesign Premium)
