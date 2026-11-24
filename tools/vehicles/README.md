# Véhicule du suivi de commande

`van.html` modélise la camionnette de livraison en 3D (Three.js) et la rend vue du dessus (jour et nuit, phares allumés).

Pour la régénérer : servir le dossier contenant `node_modules/three` en HTTP, ouvrir `van.html`, puis enregistrer `window.result.topDay` et `window.result.topNight` (data URL PNG) dans `public/vehicles/van-day.png` et `public/vehicles/van-night.png` (redimensionnés en 320 px).
