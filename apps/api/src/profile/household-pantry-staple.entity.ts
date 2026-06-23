import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Household } from './household.entity';

@Entity('household_pantry_staples')
export class HouseholdPantryStaple {
  @PrimaryColumn('uuid', { name: 'household_id' })
  householdId!: string;

  @PrimaryColumn({ name: 'ingredient_name' })
  ingredientName!: string;

  @ManyToOne(() => Household, (household) => household.pantryStaples, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'household_id' })
  household!: Household;
}
