import {
  Column,
  Entity,
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

  @Column({ type: 'uuid', name: 'food_nutrition_id', nullable: true })
  foodNutritionId!: string | null;

  @ManyToOne(() => FoodNutrition, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'food_nutrition_id' })
  foodNutrition?: FoodNutrition;

  @Column({ type: 'varchar', nullable: true })
  notes!: string | null;
}
