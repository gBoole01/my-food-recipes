import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionModule } from '../nutrition/nutrition.module';
import { Recipe } from '../recipes/recipe.entity';
import { RecipeIngredient } from '../recipes/recipe-ingredient.entity';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminRecipesController } from './admin-recipes.controller';
import { AdminRecipesService } from './admin-recipes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient]), NutritionModule],
  controllers: [AdminRecipesController],
  providers: [AdminApiKeyGuard, AdminRecipesService],
})
export class AdminModule {}
