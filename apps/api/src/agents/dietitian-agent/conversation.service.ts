import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserProfileSchema } from '@my-food-recipes/contracts';
import {
  ChatMessage,
  ProfileCompleteness,
  UserProfile,
} from './dietitian-agent.types';

const REQUIRED_FIELDS: (keyof UserProfile)[] = [
  'dietType',
  'allergies',
  'availableAppliances',
  'numberOfPeople',
];

const EXTRACTION_SYSTEM_PROMPT = `
Tu es un assistant qui extrait un profil alimentaire structuré à partir d'une conversation
en français entre un utilisateur et un diététicien virtuel. Analyse l'historique complet et
le dernier message, puis renvoie le profil le plus complet possible.

Règles :
- Ne remplis un champ que si l'information a été explicitement donnée par l'utilisateur.
- Pour "allergies" et "availableAppliances", renvoie un tableau vide si l'utilisateur a
  explicitement dit qu'il n'en a pas, et omets le champ si l'information n'a pas été abordée.
- Ne devine jamais une valeur qui n'a pas été mentionnée.
`.trim();

const REPLY_SYSTEM_PROMPT = `
Tu es un diététicien virtuel chaleureux et concis qui parle uniquement en français.
Ton but est de collecter progressivement et naturellement le profil alimentaire de
l'utilisateur : type de régime, allergies/aliments à exclure, appareils de cuisine
disponibles, et nombre de personnes à nourrir.

- Pose une seule question à la fois, en priorisant les informations encore manquantes.
- Si le profil est déjà complet, confirme-le et propose de passer aux suggestions de recettes.
- Reste bref et naturel, comme dans une vraie conversation.
`.trim();

@Injectable()
export class ConversationService implements OnModuleInit {
  private readonly logger = new Logger(ConversationService.name);
  private model: ChatGoogleGenerativeAI | null = null;
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.initializeModel();
  }

  private initializeModel(): void {
    try {
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      const geminiModel = this.configService.get<string>('GEMINI_MODEL');
      if (!apiKey) {
        this.logger.error('GEMINI_API_KEY is not set');
        return;
      }
      if (!geminiModel) {
        this.logger.error('GEMINI_MODEL is not set');
        return;
      }

      this.model = new ChatGoogleGenerativeAI({
        apiKey,
        model: geminiModel,
        temperature: 0.2,
      });

      this.isInitialized = true;
      this.logger.log('Conversation model initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize conversation model:',
        error.message,
      );
      this.isInitialized = false;
    }
  }

  async handleMessage(
    history: ChatMessage[],
    message: string,
  ): Promise<{
    reply: string;
    profile: UserProfile;
    completeness: ProfileCompleteness;
  }> {
    if (!this.isInitialized || !this.model) {
      this.initializeModel();
      if (!this.isInitialized || !this.model) {
        throw new Error('Conversation model failed to initialize');
      }
    }

    const conversationMessages = this.toLangchainMessages(history, message);

    const profile = await this.extractProfile(conversationMessages);
    const completeness = this.computeCompleteness(profile);
    const reply = await this.generateReply(conversationMessages, completeness);

    return { reply, profile, completeness };
  }

  private toLangchainMessages(
    history: ChatMessage[],
    message: string,
  ): BaseMessage[] {
    const messages: BaseMessage[] = history.map((entry) =>
      entry.role === 'user'
        ? new HumanMessage(entry.content)
        : new AIMessage(entry.content),
    );
    messages.push(new HumanMessage(message));
    return messages;
  }

  private async extractProfile(
    conversationMessages: BaseMessage[],
  ): Promise<UserProfile> {
    const structuredModel = this.model!.withStructuredOutput(UserProfileSchema);
    const result = await structuredModel.invoke([
      new SystemMessage(EXTRACTION_SYSTEM_PROMPT),
      ...conversationMessages,
    ]);
    return result as UserProfile;
  }

  private async generateReply(
    conversationMessages: BaseMessage[],
    completeness: ProfileCompleteness,
  ): Promise<string> {
    const missingFieldsNote = completeness.isComplete
      ? 'Le profil est complet.'
      : `Champs encore manquants : ${completeness.missingFields.join(', ')}.`;

    const result = await this.model!.invoke([
      new SystemMessage(`${REPLY_SYSTEM_PROMPT}\n\n${missingFieldsNote}`),
      ...conversationMessages,
    ]);

    return typeof result.content === 'string'
      ? result.content
      : JSON.stringify(result.content);
  }

  private computeCompleteness(profile: UserProfile): ProfileCompleteness {
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => profile[field] === undefined,
    );
    return { isComplete: missingFields.length === 0, missingFields };
  }
}
