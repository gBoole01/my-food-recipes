import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SeasonalityItem } from '@my-food-recipes/contracts';
import { IngredientAlias } from '../nutrition/ingredient-alias.entity';
import { SeasonalityType } from './seasonality.entity';
import { computeSeasonalityWindow } from './seasonality-window';

@Injectable()
export class SeasonalityService {
  constructor(
    @InjectRepository(IngredientAlias)
    private readonly aliasRepository: Repository<IngredientAlias>,
  ) {}

  async getSeasonalNames(
    slotDate: Date,
    batchStartDate: Date,
  ): Promise<string[]> {
    const window = computeSeasonalityWindow(
      slotDate.getMonth() + 1,
      batchStartDate.getMonth() + 1,
    );
    const rows = await this.aliasRepository
      .createQueryBuilder('a')
      .select('a.alias')
      .where('a.seasonal_months && :months', { months: window })
      .getMany();
    return [...new Set(rows.map((r) => r.alias))];
  }

  async findAllGrouped(type?: SeasonalityType): Promise<SeasonalityItem[]> {
    const qb = this.aliasRepository
      .createQueryBuilder('a')
      .where('a.seasonal_months IS NOT NULL')
      .orderBy('a.alias', 'ASC');

    if (type) {
      qb.andWhere('a.seasonal_type = :type', { type });
    }

    const rows = await qb.getMany();

    return rows.map((r) => ({
      name: r.alias,
      type: r.seasonalType as SeasonalityType,
      months: r.seasonalMonths ?? [],
    }));
  }
}
