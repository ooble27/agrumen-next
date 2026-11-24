/**
 * Toute la config de la marque est ici : changer le nom, le numéro WhatsApp
 * ou les frais de livraison se fait dans ce seul fichier.
 */
export const SITE = {
  name: "Nemsy",
  tagline: "Nems croustillants, livrés tout chauds à Dakar.",
  city: "Dakar, Sénégal",
  /**
   * Numéro WhatsApp qui reçoit les commandes, au format international sans "+".
   * Exemple : "221771234567". Laisser vide désactive l'envoi WhatsApp.
   */
  whatsapp: "",
  deliveryFee: 1000,
  freeDeliveryFrom: 10000,
  deliveryTime: "30 min",
} as const;
