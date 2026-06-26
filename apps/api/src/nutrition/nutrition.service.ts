import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FoodNutritionListResponse } from '@my-food-recipes/contracts';
import { FoodNutrition } from './food-nutrition.entity';

const PAGE_SIZE = 25;

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(FoodNutrition)
    private readonly foodNutritionRepository: Repository<FoodNutrition>,
  ) {}

  async findAll(params: {
    search?: string;
    page?: number;
  }): Promise<FoodNutritionListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;

    const qb = this.foodNutritionRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.category', 'category')
      .orderBy('food.nameFr', 'ASC')
      .skip((page - 1) * PAGE_SIZE)
      .take(PAGE_SIZE);

    if (params.search) {
      qb.where('food.name_fr ILIKE :search', { search: `%${params.search}%` });
    }

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map((food) => ({
        id: food.id,
        alimCode: food.alimCode,
        nameFr: food.nameFr,
        categoryName: food.category?.name ?? null,
        energyKcal: food.energyKcal,
        protein: food.protein,
        carbohydrate: food.carbohydrate,
        fat: food.fat,
        sugarTotal: food.sugarTotal,
        fiber: food.fiber,
        salt: food.salt,
      })),
      total,
      page,
      pageSize: PAGE_SIZE,
    };
  }
}
