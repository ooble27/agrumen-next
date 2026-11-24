# Nemsy

Application web de commande de nems et snacks, livrés au Canada. Mobile-first, avec un thème clair et un thème sombre. Prix en dollars canadiens, taxes TPS + TVQ.

## Démarrer

```bash
npm install
npm run dev
```

## Pages

| Route | Écran |
| --- | --- |
| `/` | Présentation en 3 écrans (au premier lancement) |
| `/menu` | Recherche, tri, promos, catégories, sections du menu |
| `/produit/[slug]` | Fiche produit : options, suppléments, instructions |
| `/panier` | Panier et suggestions |
| `/paiement` | Livraison ou cueillette, heure, paiement, pourboire |
| `/confirmation` | Commande confirmée et suivi |
| `/favoris`, `/profil` | Favoris, historique, coordonnées, thème |

## Personnaliser

- **Nom, ville, numéro WhatsApp, frais, taxes, horaires** : `src/lib/site.ts`
- **Produits, prix, options** : `src/lib/products.ts`
- **Illustrations des plats** : `public/food/*.svg`, générées par `tools/illustrations` (voir son README)
- **Couleurs des deux thèmes** : `src/app/globals.css`
- **Logo** : `public/logo.svg`. Les icônes de l'app installable sont dans `public/icons` et `src/app/apple-icon.png`.

## App installable (PWA)

Sur iPhone : Safari → Partager → « Sur l'écran d'accueil ». Sur Android : Chrome → « Installer l'application ». Le service worker (`public/sw.js`) garde le menu et les images en cache pour un chargement instantané. Le zoom est désactivé.

Les commandes sont envoyées sur WhatsApp au numéro défini dans `SITE.whatsapp`.

