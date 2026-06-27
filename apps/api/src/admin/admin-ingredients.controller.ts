import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { IngredientAliasListResponse } from '@my-food-recipes/contracts';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminRecipesService } from './admin-recipes.service';

@Controller('api/admin/ingredients')
@UseGuards(AdminApiKeyGuard)
export class AdminIngredientsController {
  constructor(private readonly adminRecipesService: AdminRecipesService) {}

  @Get()
  list(
    @Query('search') search?: string,
    @Query('page') page?: string,
  ): Promise<IngredientAliasListResponse> {
    return this.adminRecipesService.listAliases({
      search,
      page: page ? Number(page) : undefined,
    });
  }
}
