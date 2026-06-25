// Equipment/allergen vocabulary mirrored from apps/api/scripts/recipes-seed.data.ts
// (requiredAppliances / allergens used across the seeded recipe corpus), so
// the quick-select chips here actually match what recipes filter against.

export const EQUIPMENT_OPTIONS = [
  { value: "four", label: "Four" },
  { value: "plaque_cuisson", label: "Plaque de cuisson" },
  { value: "robot", label: "Robot pâtissier" },
  { value: "blender", label: "Blender" },
  { value: "autocuiseur", label: "Autocuiseur" },
];

export const ALLERGEN_OPTIONS = [
  { value: "gluten", label: "Gluten" },
  { value: "lactose", label: "Lactose" },
  { value: "oeufs", label: "Œufs" },
  { value: "poisson", label: "Poisson" },
  { value: "crustaces", label: "Crustacés" },
  { value: "fruits_a_coque", label: "Fruits à coque" },
  { value: "soja", label: "Soja" },
  { value: "sesame", label: "Sésame" },
];

export const PRIMARY_GOAL_OPTIONS = [
  { value: "perte_de_poids", label: "Perte de poids" },
  { value: "stabilisation", label: "Stabilisation" },
  { value: "prise_de_masse", label: "Prise de masse" },
  { value: "sante_cardio", label: "Santé cardio" },
] as const;
