import type { UserProfileInput } from "@my-food-recipes/contracts";
import type { RecipesRequest, RecipesResponse } from "../types/api";
import type { DietaryProfile, Recipe } from "../types/domain";
import { USE_MOCKS, delay, postJson } from "./client";

const RECIPES: Recipe[] = [
  {
    id: "buddha-bowl",
    name: "Buddha bowl quinoa & patate douce rôtie",
    servings: 2,
    dietTags: ["Végétarien", "Sans gluten"],
    allergens: [],
    requiredAppliances: ["Four"],
    prepTimeMinutes: 25,
    cookTimeMinutes: 20,
    nutrition: { calories: 480, protein: 18, carbs: 58, fat: 16 },
    ingredients: [
      { name: "Quinoa", quantity: 100, unit: "g", category: "Féculents & légumineuses" },
      { name: "Patate douce", quantity: 1, unit: "piece", category: "Légumes" },
      { name: "Pois chiches", quantity: 100, unit: "g", category: "Féculents & légumineuses" },
      { name: "Pousses d'épinard", quantity: 50, unit: "g", category: "Légumes" },
      { name: "Citron", quantity: 0.5, unit: "piece", category: "Légumes" },
      { name: "Huile d'olive", quantity: 1, unit: "c. à s.", category: "Épicerie" },
      { name: "Graines de courge", quantity: 1, unit: "c. à s.", category: "Épicerie" },
    ],
    steps: [
      "Préchauffer le four à 200 °C et couper la patate douce en cubes.",
      "Faire rôtir la patate douce 20 minutes avec un filet d'huile d'olive.",
      "Cuire le quinoa selon les instructions du paquet.",
      "Rincer et égoutter les pois chiches.",
      "Répartir le quinoa, la patate douce, les pois chiches et les pousses d'épinard dans des bols.",
      "Arroser de jus de citron, parsemer de graines de courge, saler et poivrer.",
    ],
  },
  {
    id: "curry-pois-chiches",
    name: "Curry de pois chiches au lait de coco",
    servings: 2,
    dietTags: ["Végan", "Sans lactose"],
    allergens: [],
    requiredAppliances: [],
    prepTimeMinutes: 30,
    cookTimeMinutes: 20,
    nutrition: { calories: 520, protein: 21, carbs: 64, fat: 19 },
    ingredients: [
      { name: "Pois chiches", quantity: 2, unit: "boîte", category: "Féculents & légumineuses" },
      { name: "Lait de coco", quantity: 400, unit: "ml", category: "Épicerie" },
      { name: "Pâte de curry", quantity: 2, unit: "c. à s.", category: "Épicerie" },
      { name: "Oignon rouge", quantity: 1, unit: "piece", category: "Légumes" },
      { name: "Tomates concassées", quantity: 200, unit: "g", category: "Épicerie" },
      { name: "Coriandre fraîche", quantity: 1, unit: "bouquet", category: "Herbes fraîches" },
      { name: "Riz basmati", quantity: 150, unit: "g", category: "Féculents & légumineuses" },
    ],
    steps: [
      "Émincer l'oignon et le faire revenir dans un peu d'huile d'olive.",
      "Ajouter la pâte de curry et cuire 1 minute en remuant.",
      "Verser le lait de coco et les tomates concassées, porter à ébullition.",
      "Ajouter les pois chiches égouttés et laisser mijoter 15 minutes.",
      "Cuire le riz basmati selon les instructions du paquet.",
      "Servir le curry sur le riz, parsemer de coriandre fraîche.",
    ],
  },
  {
    id: "saumon-papillote",
    name: "Saumon en papillote & légumes verts",
    servings: 2,
    dietTags: ["Oméga-3", "Sans gluten"],
    allergens: ["poisson"],
    requiredAppliances: ["Four"],
    prepTimeMinutes: 20,
    cookTimeMinutes: 18,
    nutrition: { calories: 410, protein: 34, carbs: 12, fat: 22 },
    ingredients: [
      { name: "Filet de saumon", quantity: 2, unit: "piece", category: "Poissons" },
      { name: "Courgette", quantity: 1, unit: "piece", category: "Légumes" },
      { name: "Brocoli", quantity: 1, unit: "piece", category: "Légumes" },
      { name: "Citron", quantity: 1, unit: "piece", category: "Légumes" },
      { name: "Huile d'olive", quantity: 1, unit: "c. à s.", category: "Épicerie" },
      { name: "Aneth ou persil", quantity: 1, unit: "bouquet", category: "Herbes fraîches" },
    ],
    steps: [
      "Préchauffer le four à 180 °C.",
      "Couper la courgette en rondelles et le brocoli en petits bouquets.",
      "Disposer le saumon et les légumes sur une feuille de papier sulfurisé.",
      "Arroser d'huile d'olive et de jus de citron, ajouter les herbes, saler et poivrer.",
      "Fermer la papillote et enfourner 18 à 20 minutes.",
    ],
  },
];

function matchesProfile(recipe: Recipe, profile: DietaryProfile): boolean {
  if (profile.regime === "Végan" && !recipe.dietTags.includes("Végan")) return false;
  if (
    profile.regime === "Végétarien" &&
    !recipe.dietTags.includes("Végétarien") &&
    !recipe.dietTags.includes("Végan")
  ) {
    return false;
  }
  if (profile.allergies.includes("Gluten") && !recipe.dietTags.includes("Sans gluten")) return false;
  if (profile.allergies.includes("Lactose") && !recipe.dietTags.includes("Sans lactose")) return false;
  return true;
}

// The chat flow (reference-only) collects a DietaryProfile; the active /api/recipes
// contract expects a UserProfileInput (packages/contracts) — this adapts at the boundary
// rather than reshaping the chat flow itself.
function toUserProfile(profile: DietaryProfile): UserProfileInput {
  return {
    dietType: profile.regime?.toLowerCase() ?? undefined,
    allergies: profile.allergies,
    availableAppliances: profile.appliances,
    numberOfPeople: profile.guestCount ?? undefined,
  };
}

async function mockRecipes(profile: DietaryProfile): Promise<Recipe[]> {
  await delay(700);
  return RECIPES.filter((recipe) => matchesProfile(recipe, profile));
}

export async function postRecipes(profile: DietaryProfile): Promise<Recipe[]> {
  if (USE_MOCKS) return mockRecipes(profile);
  const res = await postJson<RecipesRequest, RecipesResponse>("/api/recipes", {
    profile: toUserProfile(profile),
  });
  return res.recipes;
}
