import { Controller, Get, Param, Query } from '@nestjs/common';
import type { FoodNutritionListResponse, NutritionalTargets } from '@my-food-recipes/contracts';
import { NutritionCalculatorService } from './nutrition-calculator.service';
import { NutritionService } from './nutrition.service';

@Controller('api/nutrition')
export class NutritionController {
  constructor(
    private readonly nutritionService: NutritionService,
    private readonly nutritionCalculatorService: NutritionCalculatorService,
  ) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
  ): Promise<FoodNutritionListResponse> {
    return this.nutritionService.findAll({
      search,
      page: page ? Number(page) : undefined,
    });
  }

  @Get('targets/:memberId')
  async getTargets(
    @Param('memberId') memberId: string,
  ): Promise<NutritionalTargets> {
    return this.nutritionCalculatorService.getFullNutritionalTargets(memberId);
  }
}
