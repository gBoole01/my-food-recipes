import { Controller, Get } from '@nestjs/common';
import type { RecipeCatalogResponse } from '@my-food-recipes/contracts';
import { RecipesService } from './recipes.service';

@Controller('api/recipes/catalog')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async findAll(): Promise<RecipeCatalogResponse> {
    return { recipes: await this.recipesService.findAll() };
  }
}
