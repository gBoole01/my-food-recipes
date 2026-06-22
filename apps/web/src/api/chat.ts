import type { ChatRequest, ChatResponse } from "../types/api";
import type { CollectionProgress } from "../types/domain";
import { USE_MOCKS, delay, postJson } from "./client";

type FlowStep = {
  key: keyof CollectionProgress;
  question: string;
  multi: boolean;
  chips: string[];
};

const FLOW: FlowStep[] = [
  {
    key: "regime",
    question:
      "Bonjour ! Je compose des recettes équilibrées sur mesure pour vous. Pour commencer, quel régime alimentaire suivez-vous ?",
    multi: false,
    chips: ["Omnivore", "Végétarien", "Végan", "Flexitarien"],
  },
  {
    key: "allergies",
    question: "Des allergies ou intolérances à éviter ? (plusieurs choix possibles)",
    multi: true,
    chips: ["Aucune", "Gluten", "Lactose", "Fruits à coque", "Œuf"],
  },
  {
    key: "appliances",
    question: "Quels appareils de cuisine avez-vous sous la main ?",
    multi: true,
    chips: ["Four", "Plaque", "Air fryer", "Robot", "Micro-ondes"],
  },
  {
    key: "guestCount",
    question: "Et je cuisine pour combien de personnes ?",
    multi: false,
    chips: ["1", "2", "3", "4", "5", "6"],
  },
];

function toQuickReplies(chips: string[]) {
  return chips.map((label) => ({ id: label, label, value: label }));
}

async function mockChatResponse(req: ChatRequest): Promise<ChatResponse> {
  await delay(550);
  const { message, profile, progress } = req;
  const currentStepIndex = FLOW.findIndex((step) => !progress[step.key]);

  if (message.trim() !== "" && message.includes("?")) {
    return {
      reply: "Je n'ai pas bien compris votre réponse. Choisissez une option ci-dessous, ou reformulez en une phrase courte.",
      needsClarification: true,
      quickReplies: currentStepIndex >= 0 ? toQuickReplies(FLOW[currentStepIndex].chips) : undefined,
      allowMultiple: currentStepIndex >= 0 ? FLOW[currentStepIndex].multi : undefined,
      progress,
      profile,
      isComplete: false,
    };
  }

  const updatedProfile = { ...profile };
  const updatedProgress: CollectionProgress = { ...progress };

  if (currentStepIndex >= 0 && message.trim() !== "") {
    const step = FLOW[currentStepIndex];
    switch (step.key) {
      case "regime":
        updatedProfile.regime = message;
        break;
      case "allergies":
        updatedProfile.allergies = message === "Aucune" ? [] : message.split(", ");
        break;
      case "appliances":
        updatedProfile.appliances = message.split(", ");
        break;
      case "guestCount":
        updatedProfile.guestCount = Number.parseInt(message, 10) || null;
        break;
    }
    updatedProgress[step.key] = true;
  }

  const nextStepIndex = FLOW.findIndex((step) => !updatedProgress[step.key]);

  if (nextStepIndex === -1) {
    return {
      reply: "Parfait ! J'ai trouvé des recettes équilibrées qui correspondent à votre profil et à vos appareils.",
      needsClarification: false,
      progress: updatedProgress,
      profile: updatedProfile,
      isComplete: true,
    };
  }

  const next = FLOW[nextStepIndex];
  return {
    reply: next.question,
    needsClarification: false,
    quickReplies: toQuickReplies(next.chips),
    allowMultiple: next.multi,
    progress: updatedProgress,
    profile: updatedProfile,
    isComplete: false,
  };
}

export function postChatMessage(req: ChatRequest): Promise<ChatResponse> {
  if (USE_MOCKS) return mockChatResponse(req);
  return postJson<ChatRequest, ChatResponse>("/api/chat", req);
}
