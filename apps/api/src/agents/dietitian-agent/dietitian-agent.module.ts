import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from '../../recipes/recipes.module';
import { ConversationService } from './conversation.service';
import { DietitianAgentController } from './dietitian-agent.controller';
import { RecipeRecommendationService } from './recipe-recommendation.service';
import { RecipeRepositoryService } from './recipe-repository.service';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [ConfigModule, RecipesModule],
  controllers: [DietitianAgentController],
  providers: [
    ConversationService,
    RecipeRecommendationService,
    RecipeRepositoryService,
    ShoppingListService,
  ],
})
export class DietitianAgentModule {}
