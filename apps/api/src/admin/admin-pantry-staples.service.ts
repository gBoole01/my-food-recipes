import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { GlobalPantryStaple as GlobalPantryStapleDto } from '@my-food-recipes/contracts';
import { GlobalPantryStaple } from './global-pantry-staple.entity';

@Injectable()
export class AdminPantryStaplesService {
  constructor(
    @InjectRepository(GlobalPantryStaple)
    private readonly repo: Repository<GlobalPantryStaple>,
  ) {}

  async findAll(): Promise<GlobalPantryStapleDto[]> {
    const rows = await this.repo.find({ order: { name: 'ASC' } });
    return rows.map((r) => ({ id: r.id, name: r.name }));
  }

  async add(name: string): Promise<GlobalPantryStapleDto> {
    const trimmed = name.trim();
    const existing = await this.repo.findOneBy({ name: trimmed });
    if (existing) throw new ConflictException(`"${trimmed}" est déjà un fond de placard universel`);
    const saved = await this.repo.save(this.repo.create({ name: trimmed }));
    return { id: saved.id, name: saved.name };
  }

  async remove(id: string): Promise<void> {
    const exists = await this.repo.existsBy({ id });
    if (!exists) throw new NotFoundException(`Fond de placard ${id} introuvable`);
    await this.repo.delete({ id });
  }
}
