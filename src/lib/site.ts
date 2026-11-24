/**
 * Toute la config de la marque est ici : changer le nom, le numéro WhatsApp
 * ou les frais de livraison se fait dans ce seul fichier.
 */
export const SITE = {
  name: "Nemsy",
  tagline: "Nems croustillants, livrés tout chauds chez vous.",
  city: "Montréal, QC",
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
  deliveryTime: "30 min",
} as const;
