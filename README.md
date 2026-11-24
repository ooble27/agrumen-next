# Nemsy

Application web de commande de nems et snacks à Dakar. Mobile-first, avec un mode clair et un mode sombre.

## Démarrer

```bash
npm install
npm run dev
```

## Pages

| Route | Écran |
| --- | --- |
| `/` | Accueil « Nems livrés tout chauds » |
| `/menu` | Catalogue : recherche, tri, promos, catégories |
| `/produit/[slug]` | Fiche produit |
| `/panier` | Panier |
| `/paiement` | Paiement (Wave, Orange Money, espèces) et adresse |
| `/confirmation` | Commande confirmée |
| `/favoris`, `/profil` | Favoris, coordonnées et thème |

## Personnaliser

- **Nom, ville, numéro WhatsApp, frais de livraison** : `src/lib/site.ts`
- **Produits, prix, photos** : `src/lib/products.ts` (photos dans `public/img`)
- **Couleurs des deux thèmes** : `src/app/globals.css`

Les commandes partent sur WhatsApp au numéro défini dans `SITE.whatsapp`. Panier, favoris et profil sont gardés dans le navigateur du client.

Photos : [Unsplash](https://unsplash.com/license).
