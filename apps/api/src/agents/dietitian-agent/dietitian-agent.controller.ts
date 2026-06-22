import { Body, Controller, Post } from '@nestjs/common';
import {
  ChatRequestSchema,
  RecipesRequestSchema,
  ShoppingListRequestSchema,
} from '@my-food-recipes/contracts';
import { ConversationService } from './conversation.service';
import { RecipeRecommendationService } from './recipe-recommendation.service';
import { ShoppingListService } from './shopping-list.service';

@Controller('api')
export class DietitianAgentController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly recipeRecommendationService: RecipeRecommendationService,
    private readonly shoppingListService: ShoppingListService,
  ) {}

  @Post('chat')
  async chat(@Body() body: unknown) {
    const { history, message } = ChatRequestSchema.parse(body);
    return this.conversationService.handleMessage(history, message);
  }

  @Post('recipes')
  async recipes(@Body() body: unknown) {
    const { profile } = RecipesRequestSchema.parse(body);
    const recipes = await this.recipeRecommendationService.recommend(profile);
    return { recipes };
  }

  @Post('shopping-list')
  async shoppingList(@Body() body: unknown) {
    const { recipeIds, numberOfPeople } = ShoppingListRequestSchema.parse(body);
    const categories = this.shoppingListService.build(
      recipeIds,
      numberOfPeople,
    );
    return { categories };
  }
}
