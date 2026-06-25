import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seasonality } from './seasonality.entity';
import { SeasonalityController } from './seasonality.controller';
import { SeasonalityService } from './seasonality.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seasonality])],
  controllers: [SeasonalityController],
  providers: [SeasonalityService],
  exports: [TypeOrmModule, SeasonalityService],
})
export class SeasonalityModule {}
