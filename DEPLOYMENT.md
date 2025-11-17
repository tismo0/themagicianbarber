# 🚀 Guide de Déploiement & Optimisation

## The Magician – Salon de Coiffure

Guide complet pour déployer et optimiser votre site en production.

---

## 📊 Comparaison des Plateformes de Déploiement

### Vercel ⭐ RECOMMANDÉ

**Avantages** :
- ✅ Déploiement ultra-rapide
- ✅ CDN global
- ✅ HTTPS automatique
- ✅ Domaine personnalisé gratuit
- ✅ Analytics intégré
- ✅ Gratuit pour les sites statiques

**Inconvénients** :
- ❌ Payant pour les fonctionnalités avancées

**Coût** : Gratuit (plan Hobby)

**Lien** : [vercel.com](https://vercel.com)

---

### Netlify

**Avantages** :
- ✅ Déploiement facile
- ✅ Git integration
- ✅ Formulaires intégrés
- ✅ Redirects et rewrites
- ✅ Gratuit

**Inconvénients** :
- ❌ Moins rapide que Vercel
- ❌ Limites de bande passante

**Coût** : Gratuit (plan Starter)

**Lien** : [netlify.com](https://netlify.com)

---

### GitHub Pages

**Avantages** :
- ✅ Gratuit
- ✅ Intégré à GitHub
- ✅ Simple

**Inconvénients** :
- ❌ Pas de backend
- ❌ Pas de formulaires
- ❌ Moins de fonctionnalités

**Coût** : Gratuit

**Lien** : [pages.github.com](https://pages.github.com)

---

### Hébergement Classique (OVH, Hostinger, etc.)

**Avantages** :
- ✅ Contrôle total
- ✅ Pas de limitations
- ✅ Support 24/7

**Inconvénients** :
- ❌ Configuration manuelle
- ❌ Payant
- ❌ Moins performant

**Coût** : 5-20€/mois

---

## 🎯 Déploiement Recommandé : Vercel

### Étape 1 : Créer un Compte

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **Sign Up**
3. Connectez-vous avec GitHub (recommandé)
4. Autorisez Vercel

### Étape 2 : Importer le Projet

#### Option A : Via GitHub (Recommandé)

1. Poussez votre code sur GitHub
2. Sur Vercel, cliquez sur **New Project**
3. Sélectionnez votre repo
4. Cliquez sur **Import**
5. Configurez les variables d'environnement
6. Cliquez sur **Deploy**

#### Option B : Via Upload Direct

1. Sur Vercel, cliquez sur **New Project**
2. Sélectionnez **Other**
3. Uploadez vos fichiers
4. Cliquez sur **Deploy**

### Étape 3 : Configurer le Domaine

1. Allez à **Settings → Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: themagician.be)
4. Suivez les instructions DNS
5. Attendez la propagation (15-48h)

### Étape 4 : Configurer HTTPS

- Vercel active HTTPS automatiquement
- Certificat Let's Encrypt gratuit
- Renouvellement automatique

---

## 🔧 Configuration Avancée

### Variables d'Environnement

Créez un fichier `.env.local` :

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/usercopy
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://themagician.be
```

### Redirects et Rewrites

Créez un fichier `vercel.json` :

```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

### Headers de Sécurité

Ajoutez dans `vercel.json` :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📈 Optimisation Post-Déploiement

### 1. Google Analytics

#### Configuration

1. Allez sur [analytics.google.com](https://analytics.google.com)
2. Créez une nouvelle propriété
3. Copiez l'ID de suivi (G-XXXXXXXXXX)
4. Ajoutez à votre HTML :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Événements à Tracker

```javascript
// Réservation
gtag('event', 'booking_complete', {
  event_category: 'engagement',
  event_label: 'Réservation confirmée'
});

// Clic CTA
gtag('event', 'cta_click', {
  event_category: 'engagement',
  event_label: 'Réserver maintenant'
});
```

### 2. Google Search Console

1. Allez sur [search.google.com/search-console](https://search.google.com/search-console)
2. Cliquez sur **Ajouter une propriété**
3. Entrez votre domaine
4. Vérifiez la propriété (via DNS)
5. Soumettez votre sitemap

### 3. Sitemap.xml

Créez un fichier `sitemap.xml` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://themagician.be/</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://themagician.be/#services</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://themagician.be/#booking</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 4. robots.txt

Créez un fichier `robots.txt` :

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://themagician.be/sitemap.xml
```

### 5. Schema.json (Structured Data)

Ajoutez dans le `<head>` :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "The Magician",
  "description": "Salon de coiffure premium à Verviers",
  "url": "https://themagician.be",
  "telephone": "+3287447753",
  "email": "hello@themagician.be",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rue du Palais 93",
    "addressLocality": "Verviers",
    "postalCode": "4800",
    "addressCountry": "BE"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Monday",
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "image": "https://themagician.be/og-image.jpg",
  "sameAs": [
    "https://instagram.com/the_magician_barber",
    "https://facebook.com/themagician"
  ]
}
</script>
```

---

## 🔒 Sécurité

### HTTPS

- ✅ Activé automatiquement sur Vercel
- ✅ Certificat Let's Encrypt gratuit
- ✅ Renouvellement automatique

### Headers de Sécurité

Vérifiez sur [securityheaders.com](https://securityheaders.com) :

- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### Validation des Formulaires

- ✅ Validation côté client (HTML5)
- ✅ Validation côté serveur (Apps Script)
- ✅ Pas de données sensibles en localStorage

---

## 📊 Monitoring & Maintenance

### Uptime Monitoring

Utilisez [uptimerobot.com](https://uptimerobot.com) :

1. Créez un compte gratuit
2. Ajoutez votre URL
3. Recevez des alertes si le site est down

### Performance Monitoring

Utilisez [speedcurve.com](https://speedcurve.com) ou [webpagetest.org](https://webpagetest.org) :

1. Testez régulièrement
2. Comparez les performances
3. Identifiez les problèmes

### Error Tracking

Utilisez [sentry.io](https://sentry.io) :

1. Créez un compte
2. Intégrez Sentry à votre site
3. Recevez des alertes sur les erreurs

---

## 🔄 Mise à Jour & Maintenance

### Mise à Jour du Contenu

1. Modifiez les fichiers localement
2. Testez en local
3. Poussez sur GitHub
4. Vercel redéploie automatiquement

### Mise à Jour des Dépendances

1. Vérifiez les mises à jour
2. Testez en local
3. Poussez sur GitHub
4. Vercel redéploie

### Sauvegarde

1. Sauvegardez votre code sur GitHub
2. Sauvegardez votre Google Sheets
3. Exportez les réservations régulièrement

---

## 📱 Optimisation Mobile

### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Touch Icons

```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" href="/favicon.png">
```

### App Manifest

Créez un fichier `manifest.json` :

```json
{
  "name": "The Magician",
  "short_name": "The Magician",
  "description": "Salon de coiffure premium",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#d4af37",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🎯 Checklist Déploiement

### Avant le Déploiement

- [ ] Tous les tests passent
- [ ] Pas d'erreurs console
- [ ] Images optimisées
- [ ] CSS minifié
- [ ] JavaScript minifié
- [ ] Liens internes vérifiés
- [ ] Formulaires testés
- [ ] Google Sheets configuré
- [ ] Google Apps Script déployé

### Après le Déploiement

- [ ] Site accessible
- [ ] HTTPS activé
- [ ] Domaine configuré
- [ ] Google Analytics configuré
- [ ] Google Search Console configuré
- [ ] Sitemap soumis
- [ ] robots.txt créé
- [ ] Schema.json validé
- [ ] Uptime monitoring activé
- [ ] Emails de confirmation testés

---

## 📞 Support

### Ressources Utiles

- [Vercel Docs](https://vercel.com/docs)
- [Google Analytics Help](https://support.google.com/analytics)
- [Google Search Console Help](https://support.google.com/webmasters)
- [MDN Web Docs](https://developer.mozilla.org)

### Contacts

- **Vercel Support** : support@vercel.com
- **Google Support** : support.google.com
- **Votre Hébergeur** : support@votre-hebergeur.com

---

## 🎉 Félicitations !

Votre site est maintenant en production et optimisé !

**Prochaines étapes** :
- Promouvoir le site sur les réseaux sociaux
- Collecter les avis clients
- Analyser les données
- Améliorer continuellement

---

**Dernière mise à jour** : Novembre 2025
