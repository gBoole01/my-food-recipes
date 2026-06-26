import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodNutrition } from '../nutrition/food-nutrition.entity';

@Entity('global_pantry_staples')
export class GlobalPantryStaple {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Index()
  @Column({ type: 'uuid', name: 'food_nutrition_id', nullable: true })
  foodNutritionId!: string | null;

  @ManyToOne(() => FoodNutrition, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'food_nutrition_id' })
  foodNutrition?: FoodNutrition;
}
