# Illustrations des plats

Les plats sont dessinés en code (SVG) pour garder un style uniforme.

```bash
node tools/illustrations/dishes.js           # régénère public/food/*.svg
node tools/illustrations/crop.js public/food # recadre chaque dessin sur son contenu (nécessite Playwright)
```

- `lib.js` : vaisselle, aliments, verres, garnitures (lumière en haut à gauche, ombres douces)
- `dishes.js` : composition de chaque plat
