import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Seasonality } from './seasonality.entity';
import { computeSeasonalityWindow } from './seasonality-window';

@Injectable()
export class SeasonalityService {
  constructor(
    @InjectRepository(Seasonality)
    private readonly seasonalityRepository: Repository<Seasonality>,
  ) {}

  async getSeasonalNames(
    slotDate: Date,
    batchStartDate: Date,
  ): Promise<string[]> {
    const window = computeSeasonalityWindow(
      slotDate.getMonth() + 1,
      batchStartDate.getMonth() + 1,
    );
    const rows = await this.seasonalityRepository.find({
      where: { month: In(window) },
    });
    return [...new Set(rows.map((row) => row.name))];
  }
}
