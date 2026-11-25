# Véhicule du suivi de commande

- `src/lib/car3d.ts` : la voiture électrique en 3D (Three.js), utilisée dans la carte 3D.
- `carlib.js` + `cartop.html` : même modèle, pour régénérer les vues du dessus de la carte 2D de secours
  (`public/vehicles/car-day.png` et `car-night.png`). Servir ce dossier avec `node_modules/three` en HTTP,
  ouvrir `cartop.html`, enregistrer `window.res.d` et `window.res.n` (data URL PNG).
