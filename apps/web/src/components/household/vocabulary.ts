// Equipment/allergen vocabulary mirrored from apps/api/scripts/recipes-seed.data.ts
// (requiredAppliances / allergens used across the seeded recipe corpus), so
// the quick-select chips here actually match what recipes filter against.

export const EQUIPMENT_OPTIONS = [
  { value: "plaque_cuisson", label: "Plaques de cuisson" },
  { value: "four", label: "Four traditionnel" },
  { value: "micro_ondes", label: "Four à micro-ondes" },
  { value: "airfryer", label: "Airfryer" },
  { value: "cuiseur_vapeur", label: "Cuiseur vapeur" },
  { value: "grille_pain", label: "Grille-pain" },
];

export const ALLERGEN_OPTIONS = [
  { value: "gluten", label: "Gluten" },
  { value: "crustaces", label: "Crustacés" },
  { value: "oeufs", label: "Œufs" },
  { value: "poissons", label: "Poissons" },
  { value: "arachides", label: "Arachides" },
  { value: "soja", label: "Soja" },
  { value: "lait", label: "Lait" },
  { value: "fruits_a_coque", label: "Fruits à coque" },
  { value: "celeri", label: "Céleri" },
  { value: "moutarde", label: "Moutarde" },
  { value: "sesame", label: "Sésame" },
  { value: "sulfites", label: "Sulfites" },
  { value: "lupin", label: "Lupin" },
  { value: "mollusques", label: "Mollusques" },
];

export const PRIMARY_GOAL_OPTIONS = [
  { value: "perte_de_poids", label: "Perte de poids" },
  { value: "stabilisation", label: "Stabilisation" },
  { value: "prise_de_masse", label: "Prise de masse" },
  { value: "sante_cardio", label: "Santé cardio" },
] as const;

export const DIET_OPTIONS = [
  { value: "omnivore", label: "Omnivore" },
  { value: "vegetarien", label: "Végétarien" },
  { value: "vegetalien", label: "Végétalien" },
  { value: "pescetarien", label: "Pescétarien" },
  { value: "flexitarien", label: "Flexitarien" },
] as const;

export const SECONDARY_DIET_OPTIONS = [
  { value: "reduit_sel", label: "Réduit en sel" },
  { value: "anti_cholesterol", label: "Anti-cholestérol" },
  { value: "diabete_ig_bas", label: "Diabète Index Glycémique Bas" },
  { value: "pauvre_fodmaps", label: "Pauvre en FODMAPs" },
  { value: "pauvre_fibres", label: "Pauvre en fibres" },
  { value: "cetogene", label: "Cétogène" },
  { value: "low_carb", label: "Low Carb" },
  { value: "paleo", label: "Paléo" },
  { value: "sans_gluten", label: "Sans gluten" },
] as const;
