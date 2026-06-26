import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberProfile } from '../profile/member-profile.entity';
import { FoodNutrition } from './food-nutrition.entity';
import { IngredientAlias } from './ingredient-alias.entity';
import { MicronutrientTarget } from './micronutrient-target.entity';
import { NutritionCalculatorService } from './nutrition-calculator.service';
import { NutritionController } from './nutrition.controller';
import { NutritionService } from './nutrition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FoodNutrition,
      IngredientAlias,
      MicronutrientTarget,
      MemberProfile,
    ]),
  ],
  controllers: [NutritionController],
  providers: [NutritionService, NutritionCalculatorService],
  exports: [TypeOrmModule, NutritionCalculatorService],
})
export class NutritionModule {}
