import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionModule } from '../nutrition/nutrition.module';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminPantryStaplesController } from './admin-pantry-staples.controller';
import { AdminPantryStaplesService } from './admin-pantry-staples.service';
import { AdminRecipesController } from './admin-recipes.controller';
import { AdminRecipesService } from './admin-recipes.service';
import { GlobalPantryStaple } from './global-pantry-staple.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, GlobalPantryStaple]), NutritionModule],
  controllers: [AdminRecipesController, AdminPantryStaplesController],
  providers: [AdminApiKeyGuard, AdminRecipesService, AdminPantryStaplesService],
})
export class AdminModule {}
