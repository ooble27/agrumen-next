/** 8.99 -> "8,99 $", 40 -> "40 $" (format québécois, identique serveur/client). */
export function price(n: number) {
  const cents = Math.round(n * 100);
  const whole = String(Math.trunc(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  const dec = cents % 100;
  return `${whole}${dec ? "," + String(dec).padStart(2, "0") : ""}\u00a0$`;
}

/** 1 -> "01" comme dans la maquette. */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Pourcentage de réduction arrondi, ex. 8.99 / 10.99 -> 18. */
export function discount(p: number, old: number) {
  return Math.round((1 - p / old) * 100);
}
