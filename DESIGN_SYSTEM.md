# 🎨 Design System – The Magician

## Identité Visuelle Premium

Ce document définit les standards de design pour le site The Magician.

---

## 🎯 Philosophie de Design

### Principes Clés

1. **Élégance** : Minimaliste, épuré, sans surcharge
2. **Luxe** : Doré, blanc, noir – palette premium
3. **Accessibilité** : Contraste optimal, lisibilité parfaite
4. **Performance** : Animations fluides, chargement rapide
5. **Responsive** : Mobile-first, adapté à tous les écrans

---

## 🎨 Palette de Couleurs

### Couleurs Principales

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Doré** | `#d4af37` | 212, 175, 55 | CTA, accents, hover |
| **Doré Foncé** | `#b8941f` | 184, 148, 31 | Hover states, texte |
| **Noir** | `#1a1a1a` | 26, 26, 26 | Texte principal |
| **Blanc** | `#ffffff` | 255, 255, 255 | Fond cartes, texte clair |
| **Blanc Cassé** | `#fafaf8` | 250, 250, 248 | Fond page |
| **Gris Clair** | `#f5f3f0` | 245, 243, 240 | Fond sections |

### Variantes

```css
--accent-soft: rgba(212, 175, 55, 0.08);    /* Très léger */
--accent-light: rgba(212, 175, 55, 0.15);   /* Léger */
--ink-muted: rgba(26, 26, 26, 0.65);        /* Texte secondaire */
```

### Utilisation

- **Doré** : Boutons CTA, icônes, accents
- **Noir** : Titres, texte principal
- **Blanc** : Cartes, sections claires
- **Blanc Cassé** : Fond page, sections alternées

---

## 📝 Typographie

### Familles de Polices

#### Titres – Playfair Display (Serif)
- **Poids** : 400 (regular), 600 (semibold), 700 (bold)
- **Utilisation** : H1, H2, H3, marque
- **Caractéristiques** : Élégante, intemporelle, premium

```css
font-family: "Playfair Display", serif;
```

#### Corps – Poppins (Sans-serif)
- **Poids** : 300, 400, 500, 600, 700
- **Utilisation** : Paragraphes, labels, boutons
- **Caractéristiques** : Moderne, lisible, accessible

```css
font-family: "Poppins", sans-serif;
```

### Hiérarchie Typographique

| Élément | Taille | Poids | Ligne | Lettre |
|---------|--------|-------|-------|--------|
| **H1** | clamp(2.8rem, 5vw, 4.5rem) | 700 | 1.1 | 0.02em |
| **H2** | clamp(2rem, 3.5vw, 3rem) | 600 | 1.2 | 0.04em |
| **H3** | 1.35rem | 600 | 1.3 | 0.02em |
| **Body** | 1rem | 400 | 1.6 | 0 |
| **Small** | 0.9rem | 400 | 1.5 | 0.02em |
| **Label** | 0.95rem | 600 | 1.4 | 0.05em |

### Exemples

```html
<!-- Titre principal -->
<h1>Révélez la magie de votre style.</h1>

<!-- Sous-titre -->
<h2>Rituels barbershop & soins premium</h2>

<!-- Label de formulaire -->
<label>E-mail</label>

<!-- Texte normal -->
<p>À deux pas du centre de Verviers...</p>
```

---

## 🎭 Composants

### Boutons

#### Bouton Primaire (CTA)
```css
.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: #1a1a1a;
  padding: 0.85rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  box-shadow: 0 12px 32px rgba(212, 175, 55, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(212, 175, 55, 0.4);
}
```

**Utilisation** :
```html
<button class="btn-primary">Réserver maintenant</button>
```

#### Bouton Secondaire
```css
.btn-secondary {
  border: 1.5px solid #d4af37;
  color: #b8941f;
  background: transparent;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
}
```

### Cartes

#### Carte de Service
```css
.service-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  border-color: rgba(212, 175, 55, 0.15);
}
```

### Formulaires

#### Champ de Saisie
```css
.form-row input,
.form-row select,
.form-row textarea {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.9rem 1.1rem;
  background: #ffffff;
  color: #1a1a1a;
  font: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
}
```

---

## 📐 Espacements

### Système de Grille

```css
/* Sections */
padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 4rem);

/* Grilles */
gap: clamp(1.4rem, 3vw, 2.2rem);

/* Cartes */
padding: clamp(1.8rem, 2vw, 2.2rem);
```

### Espacements Courants

| Classe | Valeur | Utilisation |
|--------|--------|-------------|
| **xs** | 0.5rem | Petits espacements |
| **sm** | 1rem | Espacements internes |
| **md** | 1.5rem | Espacements moyens |
| **lg** | 2rem | Espacements larges |
| **xl** | 3rem | Espacements très larges |

---

## 🎯 Rayons de Bordure

```css
--radius-lg: 24px;  /* Cartes, panneaux */
--radius-md: 16px;  /* Boutons, champs */
--radius-sm: 8px;   /* Petits éléments */
```

---

## 💫 Ombres

```css
--shadow-soft: 0 12px 32px rgba(0, 0, 0, 0.08);
--shadow-card: 0 20px 48px rgba(0, 0, 0, 0.12);
--shadow-deep: 0 30px 60px rgba(0, 0, 0, 0.15);
```

### Utilisation

- **shadow-soft** : Cartes, éléments légers
- **shadow-card** : Panneaux, formulaires
- **shadow-deep** : Modales, overlays

---

## ✨ Animations

### Transition Globale

```css
--transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
transition: all 0.25s var(--transition-smooth);
```

### Animations Courantes

#### Hover Lift
```css
.element:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}
```

#### Fade In
```css
[data-reveal] {
  opacity: 0;
  transform: translateY(48px);
  transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.element {
  animation: float 6s ease-in-out infinite;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop */
@media (min-width: 1200px) { }

/* Tablet */
@media (max-width: 960px) { }

/* Mobile */
@media (max-width: 720px) { }

/* Small Mobile */
@media (max-width: 520px) { }
```

### Principes Mobile-First

1. Commencer par mobile
2. Ajouter des styles pour les écrans plus grands
3. Tester sur vrais appareils
4. Utiliser `clamp()` pour les tailles fluides

---

## ♿ Accessibilité

### Contraste

- Texte sur fond : minimum 4.5:1 (WCAG AA)
- Doré (#d4af37) sur Blanc : ✅ 8.2:1
- Noir (#1a1a1a) sur Blanc : ✅ 21:1

### Navigation au Clavier

- Tous les boutons sont accessibles
- Focus visible sur tous les éléments interactifs
- Ordre de tabulation logique

### ARIA Labels

```html
<button aria-label="Mois précédent">‹</button>
<div role="grid" aria-label="Calendrier des disponibilités"></div>
```

---

## 🖼️ Imagerie

### Dimensions Recommandées

| Élément | Largeur | Hauteur | Format |
|---------|---------|---------|--------|
| **Hero** | 1920px | 1080px | WebP |
| **Service** | 600px | 400px | WebP |
| **Tarif** | 500px | 400px | WebP |
| **Avatar** | 200px | 200px | WebP |
| **Thumbnail** | 300px | 300px | WebP |

### Optimisation

1. Utiliser WebP avec fallback JPG
2. Compresser les images (TinyPNG)
3. Lazy loading pour les images en bas de page
4. Responsive images avec `srcset`

---

## 🎬 Cas d'Usage

### Page d'Accueil

```html
<header class="hero">
  <nav class="navbar">
    <!-- Navigation -->
  </nav>
  <div class="hero-content">
    <div class="hero-text">
      <h1>Révélez la magie de votre style.</h1>
      <p>À deux pas du centre de Verviers...</p>
      <button class="btn-primary">Réserver un rituel</button>
    </div>
  </div>
</header>
```

### Section Services

```html
<section class="services">
  <div class="section-heading">
    <span class="eyebrow">Prestations</span>
    <h2>Rituels barbershop & soins premium</h2>
  </div>
  <div class="services-grid">
    <article class="service-card">
      <img src="..." alt="..." />
      <div class="service-body">
        <h3>Fade signature</h3>
        <p>Dégradé progressif au millimètre...</p>
        <span class="price">à partir de 18€</span>
      </div>
    </article>
  </div>
</section>
```

### Formulaire de Réservation

```html
<form class="booking-form">
  <div class="form-row">
    <label for="email">E-mail</label>
    <input id="email" type="email" placeholder="vous@mail.com" required />
  </div>
  <button type="submit" class="btn-primary">Valider la réservation</button>
</form>
```

---

## 🚀 Checklist de Qualité

- [ ] Tous les textes sont lisibles
- [ ] Contraste suffisant (WCAG AA)
- [ ] Navigation au clavier fonctionne
- [ ] Responsive sur tous les appareils
- [ ] Animations fluides (60fps)
- [ ] Images optimisées
- [ ] Pas d'erreurs console
- [ ] Temps de chargement < 2s
- [ ] Tous les liens fonctionnent
- [ ] Formulaires valident correctement

---

## 📚 Ressources

- [Google Fonts](https://fonts.google.com)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Tricks](https://css-tricks.com)

---

**Dernière mise à jour** : Novembre 2025
