import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GlobalPantryStapleCreateSchema } from '@my-food-recipes/contracts';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminPantryStaplesService } from './admin-pantry-staples.service';

@Controller('api/admin/pantry-staples')
@UseGuards(AdminApiKeyGuard)
export class AdminPantryStaplesController {
  constructor(private readonly service: AdminPantryStaplesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  add(@Body() body: unknown) {
    const { name } = GlobalPantryStapleCreateSchema.parse(body);
    return this.service.add(name);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
