import type { ShoppingListRequest, ShoppingListResponse } from "../types/api";
import type { ShoppingListGroup } from "../types/domain";
import { USE_MOCKS, delay, postJson } from "./client";

type MockItem = { id: string; name: string; qty: number; unit: string; price: number };

const CATEGORIES: { name: string; items: MockItem[] }[] = [
  {
    name: "Légumes",
    items: [
      { id: "patate", name: "Patate douce", qty: 2, unit: "", price: 1.4 },
      { id: "courgette", name: "Courgette", qty: 1, unit: "", price: 0.9 },
      { id: "epinards", name: "Pousses d'épinard", qty: 200, unit: "g", price: 2.2 },
      { id: "brocoli", name: "Brocoli", qty: 1, unit: "", price: 1.6 },
      { id: "oignon", name: "Oignon rouge", qty: 1, unit: "", price: 0.5 },
      { id: "citron", name: "Citron", qty: 1, unit: "", price: 0.4 },
    ],
  },
  {
    name: "Féculents & légumineuses",
    items: [
      { id: "quinoa", name: "Quinoa", qty: 200, unit: "g", price: 1.8 },
      { id: "poischiche", name: "Pois chiches", qty: 1, unit: "boîte", price: 1.1 },
    ],
  },
  {
    name: "Poissons",
    items: [{ id: "saumon", name: "Filet de saumon", qty: 2, unit: "", price: 6.5 }],
  },
  {
    name: "Épicerie",
    items: [
      { id: "coco", name: "Lait de coco", qty: 400, unit: "ml", price: 1.5 },
      { id: "curry", name: "Pâte de curry", qty: 2, unit: "c. à s.", price: 0.8 },
      { id: "graines", name: "Graines de courge", qty: 30, unit: "g", price: 0.6 },
    ],
  },
  {
    name: "Herbes fraîches",
    items: [{ id: "coriandre", name: "Coriandre", qty: 1, unit: "bouquet", price: 0.9 }],
  },
];

function scaleQty(qty: number, unit: string, guestCount: number): number {
  const factor = guestCount / 2;
  const scaled = qty * factor;
  const rounded = unit === "g" || unit === "ml" ? Math.round(scaled / 10) * 10 : Math.round(scaled);
  return Math.max(1, rounded);
}

async function mockShoppingList(numberOfPeople: number): Promise<ShoppingListGroup[]> {
  await delay(600);
  const guestCount = numberOfPeople || 2;
  return CATEGORIES.map((category) => ({
    category: category.name,
    items: category.items.map((item) => {
      const quantity = scaleQty(item.qty, item.unit, guestCount);
      return {
        id: item.id,
        name: item.name,
        quantity,
        unit: item.unit,
        category: category.name,
        checked: false,
        estimatedPrice: Number((item.price * (guestCount / 2)).toFixed(2)),
      };
    }),
  }));
}

function toShoppingListGroups(response: ShoppingListResponse): ShoppingListGroup[] {
  return response.categories.map((category) => ({
    category: category.category,
    items: category.items.map((item) => ({
      id: `${category.category}|${item.name}|${item.unit}`,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: category.category,
      checked: false,
    })),
  }));
}

export async function postShoppingList(
  recipeIds: string[],
  numberOfPeople: number,
): Promise<ShoppingListGroup[]> {
  if (USE_MOCKS) return mockShoppingList(numberOfPeople);
  const res = await postJson<ShoppingListRequest, ShoppingListResponse>("/api/shopping-list", {
    recipeIds,
    numberOfPeople,
  });
  return toShoppingListGroups(res);
}
