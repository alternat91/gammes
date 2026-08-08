# Gammes

Deux outils de travail pour musiciens, en pages HTML autonomes (React via CDN, aucune installation).

| Page | Contenu |
| --- | --- |
| [`index.html`](index.html) | Révision des gammes : 25 gammes et modes affichés sur clavier, manche de guitare et de basse. |
| [`accords.html`](accords.html) | Générateur d'accords de guitare : les positions jouables sont **calculées**, pas listées dans un dictionnaire. |

## Installation sur iPhone / Android

Les deux pages sont des applications installables (PWA). Sur iPhone : ouvre la page dans
**Safari** → bouton Partager → **Sur l'écran d'accueil**. L'application s'ouvre alors en plein
écran, sans l'interface de Safari, avec sa propre icône, et **fonctionne sans réseau** une fois
lancée une première fois.

Chaque page s'installe séparément, avec sa propre icône : `index.html` donne « Gammes » (clavier),
`accords.html` donne « Accords » (grille d'accords).

Le service worker (`sw.js`) met en cache les deux pages, les icônes et les librairies React au
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
