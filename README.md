# Tenisu API

Test technique L'Atelier : une API REST qui expose des joueurs de tennis et quelques statistiques.

Stack : Node.js 20+, TypeScript, Express 5, Jest + Supertest.

**API déployée sur Render : https://tenisu-api-id6d.onrender.com**

- https://tenisu-api-id6d.onrender.com/api/players
- https://tenisu-api-id6d.onrender.com/api/players/52
- https://tenisu-api-id6d.onrender.com/api/players/stats

> Hébergement gratuit : si l'API n'a pas été appelée depuis un moment, la première requête peut prendre jusqu'à une minute (le temps que le serveur se réveille).

## Lancer le projet

```bash
npm install
npm run dev
```

L'API tourne sur http://localhost:3000. Le port se change avec la variable d'environnement `PORT` (ex : `PORT=4000 npm run dev`), c'est aussi elle qu'utilisent les hébergeurs cloud.

Pour la prod : `npm run build` puis `npm start`.

## Endpoints

- `GET /api/players` : liste des joueurs triée du meilleur au moins bon (par rang)
- `GET /api/players/:id` : un joueur (400 si l'id n'est pas valide, 404 s'il n'existe pas)
- `GET /api/players/stats` : les statistiques
- `POST /api/players` : ajoute un joueur (201 + header `Location`, 400 si le body est invalide)
- `GET /health` : healthcheck
- `GET /` : liste des endpoints disponibles

Réponse de `/api/players/stats` avec les données fournies :

```json
{
  "countryWithHighestWinRatio": { "countryCode": "SRB", "winRatio": 1 },
  "averageBmi": 23.36,
  "medianHeightCm": 185
}
```

Les erreurs ont toutes le même format :

```json
{ "error": { "code": "NOT_FOUND", "message": "Player with id 999 not found" } }
```

Exemple d'ajout :

```bash
curl -X POST http://localhost:3000/api/players   -H "Content-Type: application/json"   -d '{
    "firstname": "Carlos", "lastname": "Alcaraz", "shortname": "C.ALC", "sex": "M",
    "country": { "pictureUrl": "https://example.com/spain.png", "code": "ESP" },
    "pictureUrl": "https://example.com/alcaraz.png",
    "data": { "rank": 3, "points": 2200, "weight": 74000, "height": 183, "age": 21, "last": [1, 1, 0, 1, 1] }
  }'
```

## Choix techniques

**Architecture** : routes → controller → service → repository.
Le controller ne gère que le HTTP, le service contient la logique (tri, stats) et le repository fournit les données.
Le service dépend d'une interface `PlayerRepository` : aujourd'hui les données sont en mémoire, mais on pourrait brancher une vraie API ou une base sans toucher au reste.

**Calculs** :

- Ratio de victoires par pays : j'additionne les victoires et les matchs de tous les joueurs du pays, au lieu de faire la moyenne des ratios de chaque joueur. Sinon un joueur avec très peu de matchs pèse autant que les autres.
- IMC : le poids est en grammes et la taille en cm dans les données, donc conversion en kg et en m avant le calcul.
- Médiane : si le nombre de joueurs est pair, on prend la moyenne des deux valeurs du milieu.
- Si la liste est vide, les stats renvoient `null` plutôt que `NaN` ou une erreur.

**Ajout d'un joueur** : le body est validé avec Zod (champs obligatoires, sexe `M`/`F`, code pays sur 3 lettres, résultats de matchs à 0 ou 1...). L'id est généré par le serveur, un id envoyé par le client est ignoré. Les données sont en mémoire : un joueur ajouté disparaît au redémarrage.

**Erreurs** : un middleware unique transforme les erreurs en réponse JSON. Les erreurs inattendues renvoient un 500 générique, sans détail technique.

## Tests

```bash
npm test
npm run test:coverage
npm run lint
npm run typecheck
```

- `tests/unit` : les fonctions de calcul et le service
- `tests/integration` : les endpoints via Supertest

## Avec plus de temps

- Documentation OpenAPI / Swagger
- Dockerfile
- Pagination ou filtres sur la liste des joueurs
- Une vraie base de données pour persister les joueurs ajoutés
- Mise à jour / suppression d'un joueur (PUT, DELETE)
