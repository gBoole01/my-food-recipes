import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { GlobalPantryStaple as GlobalPantryStapleDto } from '@my-food-recipes/contracts';
import { IngredientAlias } from '../nutrition/ingredient-alias.entity';

@Injectable()
export class AdminPantryStaplesService {
  constructor(
    @InjectRepository(IngredientAlias)
    private readonly repo: Repository<IngredientAlias>,
  ) {}

  async findAll(): Promise<GlobalPantryStapleDto[]> {
    const rows = await this.repo.find({
      where: { isPantryStaple: true },
      order: { alias: 'ASC' },
    });
    return rows.map((r) => ({ id: r.id, name: r.alias }));
  }

  async add(name: string): Promise<GlobalPantryStapleDto> {
    const trimmed = name.trim();
    const existing = await this.repo.findOneBy({ alias: trimmed, isPantryStaple: true });
    if (existing) throw new ConflictException(`"${trimmed}" est déjà un fond de placard universel`);
    const saved = await this.repo.save(
      this.repo.create({ alias: trimmed, isPantryStaple: true, foodNutritionId: null, notes: null }),
    );
    return { id: saved.id, name: saved.alias };
  }

  async remove(id: string): Promise<void> {
    const exists = await this.repo.existsBy({ id, isPantryStaple: true });
    if (!exists) throw new NotFoundException(`Fond de placard ${id} introuvable`);
    await this.repo.delete({ id });
  }
}
