import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seasonality } from './seasonality.entity';
import { SeasonalityService } from './seasonality.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seasonality])],
  providers: [SeasonalityService],
  exports: [TypeOrmModule, SeasonalityService],
})
export class SeasonalityModule {}
