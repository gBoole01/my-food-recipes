import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FoodCategory } from '../nutrition/food-category.entity';

export type SeasonalityType = 'fruit' | 'legume';

@Entity('seasonality')
@Unique(['name', 'month'])
export class Seasonality {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('smallint')
  month!: number;

  @Column({ type: 'varchar' })
  type!: SeasonalityType;

  @Column()
  name!: string;

  @Index()
  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => FoodCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: FoodCategory;
}
