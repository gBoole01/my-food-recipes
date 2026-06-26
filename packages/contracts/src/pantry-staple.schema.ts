import { z } from 'zod';

export const GlobalPantryStapleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});
export type GlobalPantryStaple = z.infer<typeof GlobalPantryStapleSchema>;

export const GlobalPantryStapleCreateSchema = z.object({
  name: z.string().min(1),
});
export type GlobalPantryStapleCreate = z.infer<typeof GlobalPantryStapleCreateSchema>;
