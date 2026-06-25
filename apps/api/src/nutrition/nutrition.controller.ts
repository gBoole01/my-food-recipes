import { Controller, Get, Query } from '@nestjs/common';
import type { FoodNutritionListResponse } from '@my-food-recipes/contracts';
import { NutritionService } from './nutrition.service';

@Controller('api/nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

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
}
