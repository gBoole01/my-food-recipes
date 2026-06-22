import { SystemMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Personalization,
  PersonalizationSchema,
} from '@my-food-recipes/contracts';
import {
  Recipe,
  RecommendedRecipe,
  UserProfile,
} from './dietitian-agent.types';
import { RecipeRepositoryService } from './recipe-repository.service';

const MIN_SUGGESTIONS = 3;
const MAX_SUGGESTIONS = 6;

const PERSONALIZATION_SYSTEM_PROMPT = `
Tu es un diététicien virtuel qui parle en français. On te donne le profil d'un utilisateur
et une liste de recettes déjà sélectionnées et dont les quantités sont déjà correctement
adaptées au nombre de convives. Pour chaque recette, écris une courte note personnalisée
(1 à 2 phrases) qui explique pourquoi elle convient à l'utilisateur et propose éventuellement
une petite touche additionnelle (épice, garniture, variante).

Ne modifie jamais les ingrédients, les quantités ou les étapes : contente-toi d'écrire la note.
`.trim();

@Injectable()
export class RecipeRecommendationService implements OnModuleInit {
  private readonly logger = new Logger(RecipeRecommendationService.name);
  private model: ChatGoogleGenerativeAI | null = null;
  private isInitialized = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly recipeRepository: RecipeRepositoryService,
  ) {}

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
        temperature: 0.4,
      });

      this.isInitialized = true;
      this.logger.log('Recipe recommendation model initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize recipe recommendation model:',
        error.message,
      );
      this.isInitialized = false;
    }
  }

  async recommend(profile: UserProfile): Promise<RecommendedRecipe[]> {
    const shortlist = this.filterAndScore(profile);
    const numberOfPeople = profile.numberOfPeople ?? 4;
    const scaled = shortlist.map((recipe) =>
      this.scaleToServings(recipe, numberOfPeople),
    );

    const notes = await this.personalize(profile, scaled);
    const notesById = new Map(notes.map((n) => [n.id, n.personalizedNote]));

    return scaled.map((recipe) => ({
      ...recipe,
      personalizedNote:
        notesById.get(recipe.id) ?? 'Une recette adaptée à votre profil.',
    }));
  }

  private filterAndScore(profile: UserProfile): Recipe[] {
    const allergies = profile.allergies ?? [];
    const dislikedFoods = (profile.dislikedFoods ?? []).map((f) =>
      f.toLowerCase(),
    );
    const likedFoods = (profile.likedFoods ?? []).map((f) => f.toLowerCase());
    const availableAppliances = profile.availableAppliances ?? [];

    const eligible = this.recipeRepository.findAll().filter((recipe) => {
      const hasAllergen = recipe.allergens.some((a) => allergies.includes(a));
      if (hasAllergen) return false;

      if (
        profile.dietType &&
        profile.dietType !== 'omnivore' &&
        !recipe.dietTags.includes(profile.dietType)
      ) {
        return false;
      }

      const missingAppliance = recipe.requiredAppliances.some(
        (appliance) => !availableAppliances.includes(appliance),
      );
      if (missingAppliance) return false;

      const hasDislikedIngredient = recipe.ingredients.some((ingredient) =>
        dislikedFoods.some((disliked) =>
          ingredient.name.toLowerCase().includes(disliked),
        ),
      );
      if (hasDislikedIngredient) return false;

      return true;
    });

    const scored = eligible.map((recipe) => {
      const likedMatches = recipe.ingredients.filter((ingredient) =>
        likedFoods.some((liked) =>
          ingredient.name.toLowerCase().includes(liked),
        ),
      ).length;
      return { recipe, score: likedMatches };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.recipe.prepTimeMinutes - b.recipe.prepTimeMinutes;
    });

    const count = Math.min(
      Math.max(scored.length, MIN_SUGGESTIONS),
      MAX_SUGGESTIONS,
    );
    return scored.slice(0, count).map((s) => s.recipe);
  }

  private scaleToServings(recipe: Recipe, numberOfPeople: number): Recipe {
    const ratio = numberOfPeople / recipe.servings;
    return {
      ...recipe,
      servings: numberOfPeople,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        quantity: Math.round(ingredient.quantity * ratio * 100) / 100,
      })),
    };
  }

  private async personalize(
    profile: UserProfile,
    recipes: Recipe[],
  ): Promise<Personalization> {
    if (recipes.length === 0) return [];
    if (!this.isInitialized || !this.model) {
      this.initializeModel();
      if (!this.isInitialized || !this.model) {
        return recipes.map((r) => ({ id: r.id, personalizedNote: '' }));
      }
    }

    try {
      const structuredModel = this.model.withStructuredOutput(
        PersonalizationSchema,
      );
      return await structuredModel.invoke([
        new SystemMessage(PERSONALIZATION_SYSTEM_PROMPT),
        new SystemMessage(`Profil utilisateur: ${JSON.stringify(profile)}`),
        new SystemMessage(`Recettes: ${JSON.stringify(recipes)}`),
      ]);
    } catch (error) {
      this.logger.error('Failed to personalize recipes:', error.message);
      return recipes.map((r) => ({ id: r.id, personalizedNote: '' }));
    }
  }
}
