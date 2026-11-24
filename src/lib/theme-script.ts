/** Script inline exécuté avant le rendu pour éviter le flash de thème. */
export const themeInitScript = `(function(){try{var p=JSON.parse(localStorage.getItem("nemsy-theme")||'"system"');var d=p==="dark"||(p!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;
