# MAPP MTL 2026 — Dashboard Disponibilités Stagiaires

Dashboard en temps réel connecté à la base Notion "Disponibilités stagiaires 2026".

## Structure

```
api/interns.js    → Serverless function (Vercel) qui lit la base Notion
public/index.html → Dashboard web statique
```

## Déploiement sur Vercel (3 étapes)

### 1. Créer une intégration Notion

1. Va sur **https://www.notion.so/profile/integrations**
2. Clique **Nouvelle intégration**
3. Nom : `MAPP Dashboard` (ou ce que tu veux)
4. Workspace : ton workspace MAPP
5. Copie le **Internal Integration Secret** (commence par `ntn_...`)

### 2. Partager la base avec l'intégration

1. Ouvre la base **Disponibilités stagiaires 2026** dans Notion
2. Clique **⋯** → **Connexions** → **Connecter à** → cherche **MAPP Dashboard**
3. Confirme l'accès

### 3. Déployer

**Option A — Via GitHub :**
1. Push ce dossier sur un repo GitHub
2. Va sur **vercel.com** → **New Project** → importe le repo
3. Dans **Environment Variables**, ajoute :
   - Nom : `NOTION_TOKEN`
   - Valeur : ton secret `ntn_...`
4. Deploy!

**Option B — Via Vercel CLI :**
```bash
npm i -g vercel
cd mapp-dashboard
vercel --prod
# Quand demandé, ajoute NOTION_TOKEN dans les settings du projet sur vercel.com
```

## Utilisation

Le dashboard se met à jour automatiquement quand les stagiaires modifient leurs disponibilités dans Notion. Clique **↻ Rafraîchir** pour recharger les données.

## Modifier les rencontres

Les dates de rencontres physiques sont dans `public/index.html` dans la constante `MEETINGS`. Modifie-les selon tes besoins.
