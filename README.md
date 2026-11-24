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
| `/` | Accueil « Nems livrés tout chauds » |
| `/menu` | Recherche, tri, promos, catégories, sections du menu |
| `/produit/[slug]` | Fiche produit : options, suppléments, instructions |
| `/panier` | Panier et suggestions |
| `/paiement` | Livraison ou cueillette, heure, paiement, pourboire |
| `/confirmation` | Commande confirmée et suivi |
| `/favoris`, `/profil` | Favoris, historique, coordonnées, thème |

## Personnaliser

- **Nom, ville, numéro WhatsApp, frais, taxes, horaires** : `src/lib/site.ts`
- **Produits, prix, options, photos** : `src/lib/products.ts`. Les images sont des PNG/WebP détourés, sur fond transparent, dans `public/food`.
- **Couleurs des deux thèmes** : `src/app/globals.css`
- **Logo** : `src/components/Logo.tsx`

Les commandes sont envoyées sur WhatsApp au numéro défini dans `SITE.whatsapp`.

Photos d'origine : [Unsplash](https://unsplash.com/license). Elles ont été détourées.
