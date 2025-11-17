# 🧪 Guide de Test Complet

## The Magician – Salon de Coiffure

Ce guide vous aidera à tester tous les aspects du site avant le lancement.

---

## ✅ Tests Fonctionnels

### 1. Navigation

- [ ] Tous les liens de navigation fonctionnent
- [ ] Les liens internes scroll correctement
- [ ] Le menu est accessible au clavier (Tab)
- [ ] La navbar change d'apparence au scroll
- [ ] Les liens actifs sont mis en évidence

**Test** :
```
1. Cliquez sur chaque lien de navigation
2. Vérifiez que vous êtes redirigé à la bonne section
3. Testez avec Tab pour la navigation au clavier
```

### 2. Formulaire de Réservation

- [ ] Sélection de date fonctionne
- [ ] Sélection d'horaire fonctionne
- [ ] Les créneaux réservés sont grisés
- [ ] Les horaires fermés sont désactivés
- [ ] Le formulaire valide correctement
- [ ] Les messages d'erreur s'affichent
- [ ] La confirmation s'affiche après envoi

**Test** :
```
1. Allez à la section Réservation
2. Sélectionnez une date dans le calendrier
3. Sélectionnez un horaire
4. Remplissez le formulaire
5. Cliquez sur "Valider la réservation"
6. Vérifiez que la réservation apparaît dans Google Sheets
```

### 3. Calendrier

- [ ] Navigation mois précédent/suivant fonctionne
- [ ] Les dates passées sont désactivées
- [ ] Les jours fermés sont marqués
- [ ] Les jours avec réservations sont marqués
- [ ] Aujourd'hui est mis en évidence
- [ ] Les créneaux se mettent à jour au changement de date

**Test** :
```
1. Cliquez sur les flèches de navigation
2. Vérifiez que les dates passées sont grisées
3. Sélectionnez une date avec réservations
4. Vérifiez que les créneaux sont mis à jour
```

### 4. Formulaires

- [ ] Tous les champs sont accessibles
- [ ] La validation fonctionne
- [ ] Les messages d'erreur s'affichent
- [ ] Les placeholders sont visibles
- [ ] Le focus est visible

**Test** :
```
1. Testez chaque champ du formulaire
2. Essayez de soumettre sans remplir les champs
3. Vérifiez les messages d'erreur
4. Testez avec Tab pour la navigation
```

---

## 📱 Tests Responsive

### Appareils à Tester

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile petit (320x568)

**Test avec Chrome DevTools** :
```
1. Ouvrez F12
2. Cliquez sur l'icône mobile
3. Testez chaque résolution
4. Vérifiez que tout est lisible et cliquable
```

### Éléments à Vérifier

- [ ] Texte lisible sans zoom
- [ ] Boutons cliquables (min 44x44px)
- [ ] Images adaptées à la taille
- [ ] Pas de débordement horizontal
- [ ] Navigation accessible
- [ ] Formulaires faciles à remplir

---

## 🎨 Tests Visuels

### Couleurs

- [ ] Doré (#d4af37) visible et lisible
- [ ] Contraste suffisant partout
- [ ] Pas de couleurs cassées
- [ ] Dégradés fluides

**Test** :
```
1. Utilisez WebAIM Contrast Checker
2. Testez sur un vrai écran
3. Vérifiez en mode sombre (si applicable)
```

### Typographie

- [ ] Titres lisibles
- [ ] Corps de texte confortable
- [ ] Pas de texte coupé
- [ ] Espacement correct

**Test** :
```
1. Lisez chaque section
2. Vérifiez la taille du texte
3. Testez avec zoom 200%
```

### Animations

- [ ] Animations fluides (60fps)
- [ ] Pas de saccades
- [ ] Transitions douces
- [ ] Pas de lag au scroll

**Test** :
```
1. Ouvrez DevTools → Performance
2. Scrollez le site
3. Vérifiez le FPS (doit être 60)
4. Testez les hover effects
```

---

## ⚡ Tests de Performance

### Vitesse de Chargement

- [ ] Page charge en < 2 secondes
- [ ] Images optimisées
- [ ] CSS minifié
- [ ] JavaScript optimisé

**Test avec Lighthouse** :
```
1. Ouvrez DevTools
2. Allez à Lighthouse
3. Cliquez sur "Analyze page load"
4. Vérifiez les scores
```

**Scores attendus** :
- Performance : > 90
- Accessibility : > 95
- Best Practices : > 90
- SEO : > 90

### Optimisation des Images

- [ ] Images en WebP
- [ ] Lazy loading activé
- [ ] Dimensions appropriées
- [ ] Pas d'images trop grandes

**Test** :
```
1. Ouvrez DevTools → Network
2. Rechargez la page
3. Vérifiez la taille des images
4. Vérifiez les formats (WebP)
```

---

## 🔐 Tests de Sécurité

### Formulaires

- [ ] Validation côté client
- [ ] Pas de données sensibles en clair
- [ ] HTTPS activé
- [ ] Pas de XSS

**Test** :
```
1. Essayez d'injecter du HTML dans les champs
2. Vérifiez que c'est échappé
3. Vérifiez le certificat HTTPS
```

### Données

- [ ] Pas de données sensibles en localStorage
- [ ] Pas d'API keys exposées
- [ ] Pas de mots de passe en clair

**Test** :
```
1. Ouvrez DevTools → Application
2. Vérifiez localStorage
3. Vérifiez les variables globales
```

---

## ♿ Tests d'Accessibilité

### Navigation au Clavier

- [ ] Tab fonctionne
- [ ] Shift+Tab fonctionne
- [ ] Enter active les boutons
- [ ] Espace active les cases à cocher
- [ ] Escape ferme les modales

**Test** :
```
1. Utilisez uniquement le clavier
2. Naviguez sur toute la page
3. Activez tous les boutons
4. Remplissez tous les formulaires
```

### Lecteur d'Écran

- [ ] Tous les titres sont marqués
- [ ] Les images ont des alt text
- [ ] Les formulaires ont des labels
- [ ] Les liens ont du contexte

**Test avec NVDA (gratuit)** :
```
1. Téléchargez NVDA
2. Activez le lecteur d'écran
3. Naviguez sur la page
4. Vérifiez que tout est lisible
```

### Contraste

- [ ] Texte sur fond : 4.5:1 minimum
- [ ] Éléments UI : 3:1 minimum

**Test avec WebAIM** :
```
1. Allez sur webaim.org/resources/contrastchecker/
2. Testez chaque combinaison de couleurs
3. Vérifiez les ratios
```

---

## 🌐 Tests Cross-Browser

### Navigateurs à Tester

- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Test** :
```
1. Ouvrez le site dans chaque navigateur
2. Testez la navigation
3. Testez le formulaire
4. Vérifiez les animations
5. Vérifiez les images
```

---

## 📊 Tests SEO

### Métadonnées

- [ ] Title tag présent et unique
- [ ] Meta description présent
- [ ] Favicon configuré
- [ ] Open Graph tags présents

**Test** :
```
1. Clic droit → Inspecter
2. Vérifiez le <head>
3. Vérifiez les meta tags
```

### Structure

- [ ] H1 unique
- [ ] Hiérarchie H1-H6 correcte
- [ ] Pas de H2 avant H1
- [ ] Listes structurées

**Test** :
```
1. Utilisez SEO Quake (extension Chrome)
2. Vérifiez la structure des titres
3. Vérifiez les listes
```

### Contenu

- [ ] Contenu unique
- [ ] Mots-clés pertinents
- [ ] Texte alternatif pour images
- [ ] Liens internes

**Test** :
```
1. Lisez le contenu
2. Vérifiez les alt text
3. Vérifiez les liens internes
```

---

## 🧪 Tests Manuels

### Scénarios Utilisateur

#### Scénario 1 : Réservation Simple
```
1. Ouvrir le site
2. Cliquer sur "Réserver maintenant"
3. Sélectionner une date
4. Sélectionner un horaire
5. Remplir le formulaire
6. Soumettre
7. Vérifier la confirmation
```

#### Scénario 2 : Navigation
```
1. Ouvrir le site
2. Cliquer sur chaque section
3. Lire le contenu
4. Cliquer sur les CTA
5. Revenir à l'accueil
```

#### Scénario 3 : Mobile
```
1. Ouvrir sur mobile
2. Tester la navigation
3. Tester le formulaire
4. Tester les boutons
5. Vérifier la lisibilité
```

---

## 📋 Checklist Pré-Lancement

### Avant le Lancement

- [ ] Tous les tests fonctionnels passent
- [ ] Tous les tests responsive passent
- [ ] Tous les tests de performance passent
- [ ] Tous les tests d'accessibilité passent
- [ ] Tous les tests cross-browser passent
- [ ] Tous les tests SEO passent
- [ ] Pas d'erreurs console
- [ ] Pas de warnings console
- [ ] Tous les liens fonctionnent
- [ ] Tous les formulaires fonctionnent
- [ ] Google Sheets configuré
- [ ] Google Apps Script déployé
- [ ] Domaine configuré
- [ ] HTTPS activé
- [ ] Email de confirmation fonctionne
- [ ] Analytics configuré
- [ ] Sitemap.xml créé
- [ ] robots.txt créé
- [ ] 404 page créée
- [ ] Favicon configuré

---

## 🐛 Rapport de Bug

### Template

```
Titre : [Brève description]

Navigateur : Chrome 120
Appareil : Desktop / Mobile
URL : https://...

Étapes pour reproduire :
1. ...
2. ...
3. ...

Résultat attendu :
...

Résultat réel :
...

Capture d'écran :
[Joindre une image]
```

---

## 📞 Support

Si vous trouvez un bug :

1. Notez les étapes pour le reproduire
2. Prenez une capture d'écran
3. Vérifiez la console (F12)
4. Créez un rapport de bug

---

**Dernière mise à jour** : Novembre 2025
