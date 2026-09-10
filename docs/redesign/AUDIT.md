# Refonte du portfolio — audit et direction

Audit réalisé le 10 septembre 2026, avant modification du design. Branche : `codex/redesign-portfolio-premium`, créée depuis `main` après `git pull --ff-only origin main` (déjà à jour). Aucune modification apportée à `main`.

## Architecture initiale

- React 18, TypeScript, Vite 5, React Router, Tailwind 3, composants shadcn/Radix et Lucide.
- Framer Motion déjà installé ; animations réparties dans les sections, hooks et composants décoratifs.
- Dictionnaires FR/EN et traductions des contenus directement dans les sections.
- Palette ivoire/bleu royal, trois familles de polices distantes, CSS global et longues compositions Tailwind.
- Hero statique dans le graphe JavaScript ; sections chargées avec `React.lazy`, mais montées simultanément, donc pas réellement différées au scroll.
- Portrait AVIF/WebP avec `srcset`, dimensions intrinsèques et préchargement déjà présents : acquis conservés.
- Formulaire transmis à une fonction Netlify, qui relaie à Apps Script. Contrat de données et confirmation serveur conservés.

## Première impression et parcours recruteur

L’introduction ajoute volontairement 2,5 s d’attente puis 0,6 s de sortie avant d’afficher la page. Le message professionnel arrive après l’animation de marque. Le hero cumule disponibilité, rôle changeant, description, grand portrait, actions et statistiques. Les projets n’arrivent qu’après les présentations personnelle, professionnelle et technique.

Le changement principal est structurel : identité et proposition de valeur → preuves par les projets → approche → expertise reliée à des missions → parcours → prise de contact.

## Mesures responsive avant refonte

Chrome headless, viewport de 900 px de hauteur, consentement déjà refusé pour observer la page sans bannière. Valeurs arrondies ; un viewport émulé ne remplace pas un appareil physique.

| Largeur | Hauteur du hero | Position verticale du bouton projets |
| --- | ---: | ---: |
| 320 px | 1270 px | 870 px |
| 390 px | 1332 px | 930 px |
| 768 px | 1351 px | 1063 px |
| 1440 px | 982 px | 578 px |

Le portrait pousse les actions sous le premier écran sur mobile et tablette. La navigation flottante inférieure recouvre le portrait et concurrence le menu supérieur ; la bannière cookies occupe également ce bord. Le badge « Disponible » est visible sur mobile.

Aucun débordement horizontal de la page n’a été mesuré dans cet échantillon initial. Le CSS masquait toutefois globalement l’axe horizontal et les marquees contenaient de nombreux éléments hors viewport. La nouvelle version est vérifiée sans `overflow-x: hidden` global ; seules les illustrations sont découpées dans leur propre cadre.

## Références consultées

Les observations ci-dessous sont une synthèse de direction artistique, pas une prétention à représenter tous les portfolios de 2026. Aucun template ni code de ces sites n’a été repris.

- [Linear — refonte de l’interface](https://linear.app/now/how-we-redesigned-the-linear-ui) : réduction du bruit, alignements cohérents et hiérarchie. Publication de 2024, utilisée comme référence durable, pas comme nouveauté de 2026.
- [Codrops — Arnaud Rocca, mars 2026](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/) : personnalité portée par la typographie et système de mouvements réutilisables ; le WebGL sert un propos spécifique.
- [Codrops — Designing Against the Gallery, mai 2026](https://tympanus.net/codrops/2026/05/02/designing-against-the-gallery-a-two-year-journey-to-a-layered-portfolio-experience/) : éviter une galerie qui disperse l’attention entre projets.
- [Codrops — On-Scroll Typography Animations](https://tympanus.net/Development/ScrollTypographyAnimations/) : rythme d’apparition typographique. Adaptation ici en lignes courtes, pour préserver la lecture.
- [Framer — sélection de portfolios](https://www.framer.com/marketplace/templates/categories/portfolio/) et [Dribbble — portfolios minimalistes](https://dribbble.com/search/minimal-portfolio) : repérage de compositions éditoriales et mise en avant des réalisations ; ces catalogues ne permettent pas de conclure aux performances des sites.
- [Vercel — portfolios](https://vercel.com/templates/portfolio) : référence complémentaire pour un parcours direct et des implémentations légères.
- [Apple — Motion](https://developer.apple.com/design/human-interface-guidelines/motion) : page référencée, mais le contenu technique nécessite JavaScript dans le lecteur web utilisé. Aucun détail non vérifié attribué à cette page.
- Awwwards : accès aux galeries tenté avant conception, puis à une collection ; pages indisponibles dans l’outil de recherche. Aucun site Awwwards prétendument inspecté ni score inventé.

## Direction retenue

Encre, papier et vert acide : une identité contrastée, avec une seule couleur de signal et des respirations nettes. DM Sans, hébergée localement avec sa licence OFL, remplace le mélange de trois familles. Les grandes tailles expriment les idées essentielles ; les petits repères servent le sommaire et les métadonnées.

Le portrait réel est conservé en noir et blanc, intégré à un cadre graphique. Sur mobile, il devient une composition horizontale après les actions. Le CV et les liens sociaux existants restent accessibles.

BeautyBay, Levitation et Konecta montrent des enjeux différents. Leur contenu est reformulé à partir du dépôt, sans ajouter de résultat chiffré ou revendiquer une conception intégrale des sites clients. Les visuels sont des illustrations explicitement légendées, pas des captures produit. Les 13 projets professionnels et l’intégralité de l’archive académique sont conservés et filtrables.

## Choix de mouvement

- Entrée du titre en trois lignes, décalées de 100 ms, 850 ms maximum par ligne.
- Révélations uniques des blocs au scroll, translation de 22 px et opacité, 650 ms.
- Illustration BeautyBay : légère rotation et échelle au survol.
- Illustration Levitation : séparation des plans au survol.
- Illustration Konecta : tracé du trajet au survol.
- Soulignement des liens de navigation, déplacement discret des flèches et boutons.
- Aucun mouvement décoratif continu, aucun défilement capturé, aucune boucle de rendu WebGL.
- `prefers-reduced-motion` appliqué en CSS et via Framer Motion ; effets de survol réservés aux dispositifs avec pointeur adapté.

Framer Motion suffit au système demandé. GSAP doublerait les responsabilités ; Lenis changerait le scroll natif sans besoin concret ; Three.js/React Three Fiber imposeraient un budget GPU non justifié ; Motion One doublerait la dépendance existante.

## Nettoyage et performance

Suppression de l’introduction, de la pluie de code, du carrousel de rôles, des marquees et des navigations flottantes. Les données de projets/expériences sont extraites des vues. L’archive académique est chargée à son ouverture. Google Analytics ne charge son script qu’après acceptation ; le choix de refus reste mémorisé. Les illustrations de projets sont en CSS/SVG, sans raster lourd supplémentaire.

Le build initial représentait environ 593 ko de JavaScript brut / 211 ko gzip, répartis entre des chunks tous demandés à l’affichage des sections. Les résultats finaux et leurs conditions de mesure sont consignés dans `VALIDATION.md`.

Trois erreurs bloquaient le lint initial (un `any`, une interface vide, un `require` dans Tailwind). Elles ont été corrigées. La configuration TypeScript contenait un `ignoreDeprecations` incompatible avec TypeScript 5 ; elle a été alignée pour rendre le contrôle de types exécutable.
