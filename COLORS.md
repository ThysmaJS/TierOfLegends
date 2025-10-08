# Système de Couleurs - Tier of Legends

## Variables CSS (globals.css)

### Couleurs Principales
- `--primary-dark` : #111827 (gray-900) - Fond header/footer
- `--primary-light` : #f9fafb (gray-50) - Fond contenu principal
- `--secondary-dark` : #1f2937 (gray-800) - Éléments secondaires sombres

### Couleurs de Texte
- `--text-primary` : #ffffff (white) - Texte principal sur fond sombre
- `--text-secondary` : #9ca3af (gray-400) - Texte secondaire
- `--text-dark` : #111827 (gray-900) - Texte principal sur fond clair
- `--text-medium` : #6b7280 (gray-500) - Texte moyennement contrasté
- `--text-light` : #d1d5db (gray-300) - Texte clair

### Couleurs d'Accent
- `--accent-blue` : #2563eb (blue-600) - Couleur principale des boutons/logo
- `--accent-blue-hover` : #1d4ed8 (blue-700) - État hover des éléments bleus

### Couleurs d'Alerte
- `--warning-bg` : #fef3c7 (yellow-100) - Fond des alertes
- `--warning-border` : #d97706 (yellow-600) - Bordure des alertes

### Couleurs de Carte
- `--card-bg` : #ffffff (white) - Fond des cartes
- `--card-shadow` : ombre Tailwind standard

## Utilisation dans Tailwind

### Classes personnalisées disponibles :
```css
bg-primary-dark     /* Fond header/footer */
bg-primary-light    /* Fond contenu principal */
bg-secondary-dark   /* Éléments secondaires */
text-primary        /* Texte blanc */
text-secondary      /* Texte gris moyen */
text-dark           /* Texte foncé */
bg-accent-blue      /* Couleur bleue principale */
hover:bg-accent-blue-hover /* Hover bleu */
```

### Exemples d'usage :
```tsx
// Header/Footer
<header className="bg-primary-dark text-primary">

// Contenu principal
<main className="bg-primary-light text-dark">

// Boutons
<button className="bg-accent-blue hover:bg-accent-blue-hover text-primary">

// Navigation
<nav className="text-secondary hover:text-primary">
```

## Avantages

1. **Centralisation** : Toutes les couleurs en un seul endroit
2. **Cohérence** : Même palette partout dans l'app
3. **Maintenance** : Changement de couleur en une seule modification
4. **Évolutivité** : Facile d'ajouter des thèmes (mode sombre/clair)
5. **Performance** : Variables CSS natives du navigateur
