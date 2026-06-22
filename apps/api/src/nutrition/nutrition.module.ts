import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodNutrition } from './food-nutrition.entity';
import { IngredientAlias } from './ingredient-alias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodNutrition, IngredientAlias])],
  exports: [TypeOrmModule],
})
export class NutritionModule {}
