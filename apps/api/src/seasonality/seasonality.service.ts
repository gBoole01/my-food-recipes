import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { SeasonalityItem } from '@my-food-recipes/contracts';
import { Seasonality, SeasonalityType } from './seasonality.entity';
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

  async findAllGrouped(type?: SeasonalityType): Promise<SeasonalityItem[]> {
    const rows = await this.seasonalityRepository.find({
      where: type ? { type } : {},
      order: { name: 'ASC', month: 'ASC' },
    });

    const byKey = new Map<string, SeasonalityItem>();
    for (const row of rows) {
      const key = `${row.type}:${row.name}`;
      const existing = byKey.get(key);
      if (existing) {
        existing.months.push(row.month);
      } else {
        byKey.set(key, { name: row.name, type: row.type, months: [row.month] });
      }
    }
    return [...byKey.values()];
  }
}
