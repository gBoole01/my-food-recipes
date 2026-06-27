import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AdminRecipeCreateSchema,
  AdminRecipeUpdateSchema,
} from '@my-food-recipes/contracts';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminRecipesService } from './admin-recipes.service';

@Controller('api/admin/recipes')
@UseGuards(AdminApiKeyGuard)
export class AdminRecipesController {
  constructor(private readonly adminRecipesService: AdminRecipesService) {}

  @Get()
  findAll() {
    return this.adminRecipesService.findAll();
  }

  @Get('ingredient-aliases')
  searchAliases(@Query('search') search?: string) {
    return this.adminRecipesService.searchAliases(search ?? '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminRecipesService.findOne(id);
  }

  @Post()
  create(@Body() body: unknown) {
    const input = AdminRecipeCreateSchema.parse(body);
    return this.adminRecipesService.create(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const input = AdminRecipeUpdateSchema.parse(body);
    return this.adminRecipesService.update(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.adminRecipesService.remove(id);
  }
}
