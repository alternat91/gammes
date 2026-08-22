# Gammes

Cinq outils de travail en pages HTML autonomes (React via CDN, aucune installation) : trois pour
les musiciens, deux pour les pilotes. Les pages d'une même famille se renvoient les unes aux
autres par un bouton de navigation accessible à tout moment.

### Musique

| Page | Contenu |
| --- | --- |
| [`index.html`](index.html) | Révision des gammes : 25 gammes et modes affichés sur clavier, manche de guitare et de basse. |
| [`accords.html`](accords.html) | Générateur d'accords de guitare : les positions jouables sont **calculées**, pas listées dans un dictionnaire. |
| [`progressions.html`](progressions.html) | Doigtés pour des suites d'accords typiques (2‑5‑1, 1‑6‑4‑5, cadence andalouse, blues 12 mesures…), dans n'importe quelle tonalité. |

### Vol aux instruments

| Page | Contenu |
| --- | --- |
| [`ifr.html`](ifr.html) | Révision IFR : 41 fiches de calculs et de formules, plus un quiz qui tire des questions chiffrées au hasard et corrige pas à pas. |
| [`pilote.html`](pilote.html) | Boîte à outils du pilote : 11 calculateurs de vol, du début de descente au décodage d'un METAR, tous utilisables hors réseau. |

## Installation sur iPhone / Android

Les cinq pages sont des applications installables (PWA). Sur iPhone : ouvre la page dans
**Safari** → bouton Partager → **Sur l'écran d'accueil**. L'application s'ouvre alors en plein
écran, sans l'interface de Safari, avec sa propre icône, et **fonctionne sans réseau** une fois
lancée une première fois.

Chaque page s'installe séparément, avec sa propre icône : `index.html` donne « Gammes » (clavier),
`accords.html` donne « Accords » (grille d'accords), `progressions.html` donne « Suites » (grilles
chaînées par une flèche), `ifr.html` donne « IFR » (horizon artificiel) et `pilote.html` donne
« Outils » (règle à calcul circulaire).

Le service worker (`sw.js`) met en cache les cinq pages, les icônes et les librairies React au
premier chargement, puis sert tout depuis le cache en le rafraîchissant en arrière-plan. Pour
publier une nouvelle version, incrémente `VERSION` dans `sw.js` : l'ancien cache est supprimé au
prochain lancement.

## Le générateur d'accords

Choisis une tonique, un type d'accord (29 types, des triades aux dominantes altérées) et un
accordage (standard, Drop D, ½ ton bas, DADGAD, Open G, Open D) : l'application cherche sur le
manche toutes les positions possibles, écarte celles qui ne sont pas jouables, puis classe les
meilleures.

Une position est retenue si elle contient toutes les notes indispensables de l'accord, tient en
4 cases, se joue avec 4 doigts au maximum (barré compris) et pose la fondamentale à la basse —
sauf si les renversements sont autorisés. Le classement favorise ensuite les positions basses sur
le manche, les cordes à vide, les doigtés compacts et les accords sans frottement dans le grave.

Chaque grille indique le doigté (1 index → 4 auriculaire), le barré, les cordes à vide et
étouffées, la case de départ et la tablature. Le bouton ▶ joue l'accord : les cordes sont
synthétisées à la volée (Karplus-Strong via l'API Web Audio), sans aucun fichier son.

## Les suites d'accords

Choisis une tonalité et une suite (rangée par style : Pop & Rock, Jazz, Blues, Mineur, Emprunts,
Ballades — 22 suites au total), et la page affiche chaque accord de la grille avec sa meilleure
position, chaînés par une flèche dans l'ordre de jeu. Chaque case affiche son chiffrage romain
(ii, V, I…) — calculé à partir de la tonalité, pas mémorisé — et son symbole d'accord.

**Position sur le manche** déplace toute la suite vers une zone donnée (cordes à vide, case 3, 5,
7, 9…) en une seule action : plutôt que de filtrer une liste de positions déjà calculée, la
recherche de doigtés est relancée en ciblant directement cette case, pour que chaque zone renvoie
de vraies positions locales même sur un accord dont la forme la plus facile se trouve ailleurs sur
le manche. Les flèches ‹ › sous une grille affinent ensuite un seul accord, sans toucher aux autres.

Le toggle **Avec 7es** bascule chaque accord entre triade simple et accord de septième diatonique
(dominante sur le V, majeur 7 ou mineur 7 ailleurs) — utile pour retrouver le son des grilles jazz.
Le bouton **▶ Jouer la suite** joue les accords dans l'ordre, à la vitesse choisie (Lent, Moyen,
Rapide), avec la grille en cours de lecture mise en évidence.

Les cadences empruntées (comme le V majeur d'une cadence andalouse en tonalité mineure, ou le ♭VII
d'une couleur mixolydienne) sont écrites explicitement plutôt que déduites d'une table générique,
pour rester justes même quand elles s'écartent de la gamme diatonique.

### Substitutions d'accords

Sous chaque grille, des pastilles proposent de remplacer l'accord par une substitution courante —
sans changer sa fonction dans la suite (le chiffrage romain reste affiché, avec un badge ⇄) :

- **Tritonique** — remplace une dominante par celle à un triton (ex. G7 → D♭7), disponible
  uniquement sur les accords de septième de dominante.
- **Relatif** — bascule entre un accord et son relatif majeur ou mineur (ex. Dm7 → Fmaj7).
- **Parallèle** — bascule majeur/mineur sur la même fondamentale (ex. Cmaj7 → Cm7).

Chaque substitution est un choix harmonique (fonction et qualité), pas une hauteur figée : elle
reste active si tu changes de tonalité, d'accordage ou de zone du manche, et ne repart à zéro que
si tu choisis une autre suite. Les accords diminués et demi-diminués (ii° d'un turnaround mineur,
par exemple) n'affichent aucune substitution : leur reharmonisation dépend trop du contexte pour
une règle générique fiable.

## Révision IFR

L'onglet **Fiches** regroupe 41 formules par thème — descente, virages, vent et navigation,
altimétrie, temps et carburant, procédures. Chaque fiche donne la formule exacte, la règle de
calcul mental correspondante, une explication de ce qu'elle recouvre et un exemple chiffré. Une
recherche plein texte permet de retrouver une formule sans passer par les thèmes.

L'onglet **Quiz** tire des questions au hasard dans les thèmes sélectionnés : 29 générateurs
numériques (taux de descente, dérive, altitude densité, TAS, PET…) et 7 questions à choix
multiples sur la réglementation. Chaque question est validée avec une tolérance affichée, puis
corrigée étape par étape. La série en cours et le meilleur score sont conservés d'une session à
l'autre.

Les exemples des fiches et les réponses du quiz **sont calculés par les mêmes fonctions**, jamais
recopiés : un exemple ne peut pas contredire la formule qu'il illustre. Les fonctions de calcul
sont partagées mot pour mot avec la boîte à outils.

## Boîte à outils pilote

Onze calculateurs, chacun avec ses résultats recalculés à la frappe :

| Outil | Ce qu'il donne |
| --- | --- |
| Descente | Début de descente, taux, gradient, durée, et la table altitude/distance du plan |
| Montée | Taux minimum pour un gradient publié, gradient réellement obtenu, altitude gagnée |
| Vent | Dérive, cap à tenir, vitesse sol et composantes, avec une rose du vent dessinée |
| Virage | Inclinaison, rayon, taux, durée et anticipation du point de virage |
| Altimétrie | Altitude pression et densité, déviation ISA, QFE, correction par temps froid (PANS-OPS) |
| Vitesses | TAS, Mach et EAS par le calcul compressible exact, comparés à la règle des 2 % |
| Nav & fuel | Durée d'étape et bilan carburant complet, imprévus et réserve finale compris |
| PET / PNR | Point d'égal temps et point de non-retour, en distance et en temps |
| Attente | Secteur d'entrée avec schéma, vitesses maximales, chronométrage, triple dérive |
| Conversions | Distances, vitesses, altitudes, pressions, volumes, masses, températures, carburant |
| METAR | Décodage complet d'un message, plus humidité, base des nuages et écart au calage standard |

Les valeurs saisies sont conservées d'une ouverture à l'autre : en vol, on rouvre un outil pour
ajuster un chiffre, pas pour tout ressaisir. Le décodage METAR est fait localement — rien n'est
envoyé nulle part, et l'outil reste utilisable sans réseau.

Ces deux applications sont des aides à la révision et au calcul mental : elles ne remplacent ni la
documentation officielle, ni les cartes, ni le manuel de vol.
