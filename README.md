# Site Web Élagueur

Site vitrine professionnel pour un élagueur proposant des services de débardage forestier, élagage et travaux forestiers. Site destiné à être déployé en production.

---

## Structure du projet

```
site-elagueur/
├── index.html
├── prestations.html
├── realisations.html
├── contact.html
├── mentions-legales.html
├── politique-confidentialite.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── .htaccess                  # Redirections, HTTPS forcé, cache
├── css/
│   ├── style.css
│   └── reset.css
├── js/
│   ├── main.js
│   └── gallery.js             # Galerie photos
├── images/
│   ├── hero/                  # Format WebP + fallback JPG
│   ├── prestations/
│   ├── realisations/
│   └── icons/                 # Favicon + icônes
├── fonts/                     # Polices auto-hébergées (RGPD)
└── README.md
```

---

## Pages à créer

### 1. Accueil (`index.html`)
- [ ] Balise `<title>` et `<meta description>` optimisées SEO
- [ ] Bannière hero avec photo + slogan + CTA "Demander un devis"
- [ ] Présentation rapide des 3 prestations avec liens
- [ ] Section "Pourquoi nous choisir" (expérience, assurance, matériel)
- [ ] Section avis clients (Google Reviews ou témoignages)
- [ ] Zone géographique d'intervention
- [ ] Footer : coordonnées, liens légaux, réseaux sociaux

### 2. Prestations (`prestations.html`)
- [ ] **Élagage** : formation, entretien, sanitaire, abattage
- [ ] **Débardage forestier** : méthodes (câble, treuil, tracteur...)
- [ ] **Travaux forestiers** : débroussaillage, broyage, plantation, coupe rase
- [ ] Photo + description + bouton devis pour chaque prestation

### 3. Réalisations (`realisations.html`)
- [ ] Galerie photos lazy-loaded (images compressées WebP)
- [ ] Filtres par type de prestation
- [ ] Lightbox pour agrandir les photos
- [ ] Description courte par chantier

### 4. Contact (`contact.html`)
- [ ] Formulaire : nom, téléphone, email, prestation, message
- [ ] Validation côté client (JS) + protection anti-spam (honeypot ou reCAPTCHA)
- [ ] Carte Google Maps (zone d'intervention)
- [ ] Téléphone cliquable (`tel:`)
- [ ] Email cliquable (`mailto:`)
- [ ] Horaires d'intervention

### 5. Mentions légales (`mentions-legales.html`)
- [ ] Éditeur du site (nom, adresse, SIRET)
- [ ] Hébergeur (nom, adresse, contact)
- [ ] Directeur de publication
- [ ] Propriété intellectuelle

### 6. Politique de confidentialité (`politique-confidentialite.html`)
- [ ] Données collectées via le formulaire
- [ ] Durée de conservation
- [ ] Droits de l'utilisateur (accès, rectification, suppression)
- [ ] Contact DPO ou responsable traitement
- [ ] Cookies utilisés (analytics, maps)

### 7. Page 404 (`404.html`)
- [ ] Message d'erreur clair
- [ ] Lien retour accueil

---

## Contenu à récupérer auprès du client

- [ ] Nom de l'entreprise + nom du gérant
- [ ] Adresse complète
- [ ] Numéro de téléphone
- [ ] Adresse email professionnelle
- [ ] Numéro SIRET
- [ ] Assurance RC Pro (numéro de contrat + compagnie)
- [ ] Zone géographique d'intervention (départements / communes)
- [ ] Photos des chantiers réalisés (format original, min 1200px)
- [ ] Logo (format SVG ou PNG fond transparent)
- [ ] Charte graphique / couleurs souhaitées
- [ ] Avis clients à afficher
- [ ] Textes de présentation (ou à rédiger)

---

## Design & UX

- [ ] Mobile first — responsive sur tous écrans
- [ ] Palette : suggestion vert forêt (#2d5a27) + beige bois (#c8a96e) + blanc
- [ ] Polices auto-hébergées (pas de Google Fonts → RGPD)
- [ ] Contraste suffisant (WCAG AA minimum)
- [ ] Navigation claire avec menu burger sur mobile
- [ ] CTA visible sur chaque page ("Demander un devis")
- [ ] Temps de chargement cible < 3 secondes

---

## Performance

- [ ] Images converties en WebP avec fallback JPG/PNG
- [ ] Images lazy-loaded (`loading="lazy"`)
- [ ] CSS et JS minifiés pour la prod
- [ ] Pas de librairies inutiles (garder le site léger)
- [ ] Compression Gzip/Brotli activée sur le serveur
- [ ] Cache navigateur configuré (`.htaccess`)
- [ ] Score Lighthouse cible : > 90 sur les 4 catégories

---

## SEO

- [ ] Balises `<title>` uniques par page (50-60 caractères)
- [ ] `<meta description>` par page (150-160 caractères)
- [ ] Balises Hn cohérentes (un seul H1 par page)
- [ ] Attributs `alt` sur toutes les images
- [ ] Schema.org LocalBusiness (données structurées JSON-LD)
- [ ] `sitemap.xml` soumis à Google Search Console
- [ ] `robots.txt` configuré
- [ ] URL canoniques (`<link rel="canonical">`)
- [ ] Open Graph (partage réseaux sociaux)
- [ ] Google My Business créé et lié au site
- [ ] Mots-clés ciblés : "élagueur [ville]", "débardage forestier [région]", "travaux forestiers [département]"

---

## Sécurité

- [ ] HTTPS obligatoire (certificat SSL Let's Encrypt ou hébergeur)
- [ ] Redirection HTTP → HTTPS dans `.htaccess`
- [ ] En-têtes de sécurité HTTP (CSP, X-Frame-Options, HSTS...)
- [ ] Protection formulaire anti-spam (honeypot + reCAPTCHA v3)
- [ ] Pas de données sensibles exposées côté client
- [ ] Bannière cookies conforme RGPD avec consentement réel

---

## RGPD

- [ ] Bannière cookies (analytics et Maps nécessitent consentement)
- [ ] Google Analytics configuré en mode anonymisation IP (ou remplacé par Matomo)
- [ ] Google Fonts supprimé → polices auto-hébergées
- [ ] Formulaire de contact : case à cocher consentement traitement des données
- [ ] Mentions légales et politique de confidentialité complètes
- [ ] Pas de transfert de données hors UE sans mention

---

## Déploiement

- [ ] Choisir l'hébergement (suggestion : OVH Pro, Infomaniak ou Netlify)
- [ ] Acheter le nom de domaine (suggestion : prenom-nom-elagueur.fr ou nom-entreprise.fr)
- [ ] Configurer le DNS
- [ ] Activer le certificat SSL
- [ ] Mettre en place les redirections (www → non-www ou inverse)
- [ ] Tester sur tous les navigateurs (Chrome, Firefox, Safari, Edge)
- [ ] Tester sur mobile (iOS + Android)
- [ ] Soumettre le sitemap à Google Search Console
- [ ] Soumettre à Bing Webmaster Tools
- [ ] Vérifier les liens cassés avant mise en ligne

---

## Tests avant mise en ligne

- [ ] Lighthouse audit (Performance, SEO, Accessibilité, Best Practices)
- [ ] W3C Validator HTML
- [ ] Test formulaire de contact (réception email)
- [ ] Test sur mobile (iOS + Android)
- [ ] Test vitesse : GTmetrix ou PageSpeed Insights
- [ ] Vérification mentions légales / RGPD complètes
- [ ] Test 404 personnalisée
- [ ] Vérification HTTPS sur toutes les pages
