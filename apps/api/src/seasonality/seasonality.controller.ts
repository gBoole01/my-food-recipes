import { Controller, Get, Query } from '@nestjs/common';
import type { SeasonalityListResponse } from '@my-food-recipes/contracts';
import { SeasonalityType } from './seasonality.entity';
import { SeasonalityService } from './seasonality.service';

@Controller('api/seasonality')
export class SeasonalityController {
  constructor(private readonly seasonalityService: SeasonalityService) {}

  @Get()
  async findAll(
    @Query('type') type?: SeasonalityType,
  ): Promise<SeasonalityListResponse> {
    return { items: await this.seasonalityService.findAllGrouped(type) };
  }
}
