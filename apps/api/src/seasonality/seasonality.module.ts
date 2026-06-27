import { Module } from '@nestjs/common';
import { NutritionModule } from '../nutrition/nutrition.module';
import { SeasonalityController } from './seasonality.controller';
import { SeasonalityService } from './seasonality.service';

@Module({
  imports: [NutritionModule],
  controllers: [SeasonalityController],
  providers: [SeasonalityService],
  exports: [SeasonalityService],
})
export class SeasonalityModule {}
