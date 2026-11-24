/** 2500 -> "2 500 F" (espaces insécables, identique serveur/client). */
export function price(n: number) {
  return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} F`;
}

/** 1 -> "01" comme dans la maquette. */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}
