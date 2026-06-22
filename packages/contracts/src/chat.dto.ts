import { z } from 'zod';

// Reference-only: this is the contract for the chat-based profile-collection flow
// (ConversationService), which is superseded by the wizard/dashboard architecture
// described in TODO.md. Kept here verbatim in case that flow is revived.
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

export const ChatRequestSchema = z.object({
  history: z.array(ChatMessageSchema).default([]),
  message: z.string().min(1),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
