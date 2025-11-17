# ⚡ Quick Start – Démarrage Rapide

## The Magician – Lancez-vous en 5 Minutes !

Guide ultra-rapide pour commencer immédiatement.

---

## 🚀 5 Étapes Essentielles

### 1️⃣ Configurer Google Sheets (5 min)

```
1. Allez sur sheets.google.com
2. Créez une feuille "The Magician - Réservations"
3. Créez les colonnes : date | time | email | instagram | service | details
4. C'est prêt !
```

### 2️⃣ Créer Google Apps Script (5 min)

```
1. Ouvrez la feuille
2. Allez à Outils → Éditeur Apps Script
3. Collez le code (voir INSTALLATION.md)
4. Cliquez sur Déployer → Nouveau déploiement
5. Copiez l'URL
```

### 3️⃣ Configurer le Site (5 min)

```
1. Ouvrez config.js
2. Remplacez GOOGLE_WEBAPP_URL par votre URL
3. Modifiez les infos du salon
4. Mettez à jour les horaires
5. C'est prêt !
```

### 4️⃣ Tester Localement (5 min)

```
1. Lancez un serveur local (python -m http.server 8000)
2. Ouvrez http://localhost:8000
3. Testez le formulaire
4. Vérifiez Google Sheets
```

### 5️⃣ Déployer sur Vercel (5 min)

```
1. Allez sur vercel.com
2. Connectez GitHub
3. Importez le projet
4. Cliquez sur Déployer
5. Configurez le domaine
```

---

## 📋 Fichiers Importants

| Fichier | Rôle | À Modifier |
|---------|------|-----------|
| `index.html` | Structure | Textes, images |
| `style.css` | Design | Couleurs (optionnel) |
| `main.js` | Logique | Rien (sauf avancé) |
| `config.js` | Configuration | **OUI** (important) |

---

## 🎯 Configuration Minimale

### config.js

```javascript
const CONFIG = {
  salon: {
    name: "The Magician",
    phone: "+3287447753",
    email: "hello@themagician.be",
    address: "Rue du Palais 93, 4800 Verviers",
  },
  
  googleAppsScript: {
    webAppUrl: "VOTRE_URL_ICI", // ← À remplir !
    enabled: true,
  },
};
```

---

## 🔗 Liens Essentiels

| Service | Lien | Action |
|---------|------|--------|
| **Google Sheets** | sheets.google.com | Créer feuille |
| **Google Apps Script** | script.google.com | Créer script |
| **Vercel** | vercel.com | Déployer |
| **Google My Business** | google.com/business | Créer fiche |
| **Google Search Console** | search.google.com/search-console | Soumettre sitemap |

---

## ✅ Checklist Rapide

- [ ] Google Sheets créée
- [ ] Google Apps Script déployé
- [ ] URL copiée dans config.js
- [ ] Infos salon mises à jour
- [ ] Horaires corrects
- [ ] Testé localement
- [ ] Déployé sur Vercel
- [ ] Domaine configuré
- [ ] Google My Business créé

---

## 🆘 Problèmes Courants

### Le formulaire ne fonctionne pas

```
✓ Vérifiez que l'URL Apps Script est correcte
✓ Vérifiez que googleAppsScript.enabled = true
✓ Ouvrez F12 → Console pour voir les erreurs
```

### Les réservations n'apparaissent pas

```
✓ Vérifiez que Google Sheets a les bonnes colonnes
✓ Vérifiez que le Apps Script a les bonnes permissions
✓ Testez le Apps Script directement
```

### Le site est lent

```
✓ Compressez les images
✓ Vérifiez les performances (Lighthouse)
✓ Utilisez un CDN (Vercel le fait automatiquement)
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **INSTALLATION.md** – Installation détaillée
- **DESIGN_SYSTEM.md** – Design complet
- **TESTING.md** – Tests complets
- **DEPLOYMENT.md** – Déploiement avancé
- **SEO.md** – Optimisation SEO
- **MAINTENANCE.md** – Maintenance

---

## 🎬 Prochaines Étapes

### Jour 1
- [ ] Configuration Google Sheets
- [ ] Configuration Google Apps Script
- [ ] Configuration config.js

### Jour 2
- [ ] Test local
- [ ] Ajustements
- [ ] Déploiement Vercel

### Jour 3
- [ ] Configuration domaine
- [ ] Google My Business
- [ ] Google Search Console

### Semaine 2
- [ ] Promouvoir sur réseaux sociaux
- [ ] Collecter les avis
- [ ] Analyser les données

---

## 💡 Conseils

1. **Commencez simple** – Configurez le minimum d'abord
2. **Testez régulièrement** – Vérifiez que tout fonctionne
3. **Sauvegardez** – Utilisez GitHub
4. **Documentez** – Notez vos modifications
5. **Analysez** – Vérifiez les données

---

## 🎉 Vous Êtes Prêt !

Votre site premium est maintenant prêt à être lancé.

**Bon lancement ! 🚀**

---

**Dernière mise à jour** : Novembre 2025
