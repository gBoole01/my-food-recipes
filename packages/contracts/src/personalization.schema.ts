import { z } from 'zod';

export const PersonalizationSchema = z.array(
  z.object({
    id: z.string().min(1),
    personalizedNote: z.string().min(1),
  }),
);

export type Personalization = z.infer<typeof PersonalizationSchema>;
