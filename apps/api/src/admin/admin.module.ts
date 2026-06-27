import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionModule } from '../nutrition/nutrition.module';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminIngredientsController } from './admin-ingredients.controller';
import { AdminPantryStaplesController } from './admin-pantry-staples.controller';
import { AdminPantryStaplesService } from './admin-pantry-staples.service';
import { AdminRecipesController } from './admin-recipes.controller';
import { AdminRecipesService } from './admin-recipes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient]), NutritionModule],
  controllers: [AdminRecipesController, AdminIngredientsController, AdminPantryStaplesController],
  providers: [AdminApiKeyGuard, AdminRecipesService, AdminPantryStaplesService],
})
export class AdminModule {}
