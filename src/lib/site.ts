/**
 * Toute la config de la marque est ici : nom, ville, numéro de commande,
 * frais, taxes et horaires se changent dans ce seul fichier.
 */
export const SITE = {
  name: "Nemsy",
  tagline: "Nems croustillants, livrés tout chauds chez vous.",
  city: "Montréal, QC",
  /** Adresse affichée pour la cueillette sur place. */
  pickupAddress: "Montréal, QC",
  /**
   * Numéro WhatsApp qui reçoit les commandes, au format international sans "+".
   * Exemple : "15145550123". Laisser vide désactive l'envoi WhatsApp.
   */
  whatsapp: "",
  /** Montants en dollars canadiens. */
  deliveryFee: 4.99,
  freeDeliveryFrom: 40,
  /** Taxes appliquées au sous-total + livraison (Québec : TPS 5 % + TVQ 9,975 %). */
  taxRate: 0.14975,
  taxLabel: "Taxes (TPS + TVQ)",
  /** Délai affiché, en minutes. */
  etaMin: 25,
  etaMax: 35,
  rating: "4,9",
  reviews: "500+",
  /** Créneaux proposés pour une commande planifiée (heure locale). */
  openHour: 11,
  closeHour: 21,
} as const;

export const ETA = `${SITE.etaMin}–${SITE.etaMax} min`;
