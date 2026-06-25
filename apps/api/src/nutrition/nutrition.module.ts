import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodNutrition } from './food-nutrition.entity';
import { IngredientAlias } from './ingredient-alias.entity';
import { NutritionController } from './nutrition.controller';
import { NutritionService } from './nutrition.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodNutrition, IngredientAlias])],
  controllers: [NutritionController],
  providers: [NutritionService],
  exports: [TypeOrmModule],
})
export class NutritionModule {}
