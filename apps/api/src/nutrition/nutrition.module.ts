import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodNutrition } from './food-nutrition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodNutrition])],
  exports: [TypeOrmModule],
})
export class NutritionModule {}
