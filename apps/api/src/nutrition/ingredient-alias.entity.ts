import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodNutrition } from './food-nutrition.entity';

@Entity('ingredient_aliases')
export class IngredientAlias {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  alias!: string;

  @Index()
  @Column({ type: 'uuid', name: 'food_nutrition_id', nullable: true })
  foodNutritionId!: string | null;

  @ManyToOne(() => FoodNutrition, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'food_nutrition_id' })
  foodNutrition?: FoodNutrition;

  @Column({ type: 'boolean', name: 'is_pantry_staple', default: false })
  isPantryStaple!: boolean;

  @Column({ type: 'varchar', length: 10, name: 'seasonal_type', nullable: true })
  seasonalType!: 'fruit' | 'legume' | null;

  @Column({ type: 'int', name: 'seasonal_months', array: true, nullable: true })
  seasonalMonths!: number[] | null;

  @Column({ type: 'varchar', nullable: true })
  notes!: string | null;
}
