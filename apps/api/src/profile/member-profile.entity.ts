import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Household } from './household.entity';
import { MemberAllergen } from './member-allergen.entity';
import { MemberExcludedIngredient } from './member-excluded-ingredient.entity';

export type PrimaryGoal =
  | 'perte_de_poids'
  | 'stabilisation'
  | 'prise_de_masse'
  | 'sante_cardio';

export type Diet =
  | 'omnivore'
  | 'vegetarien'
  | 'vegetalien'
  | 'paleo'
  | 'sans_gluten';

@Entity('member_profiles')
export class MemberProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'household_id' })
  householdId!: string;

  @ManyToOne(() => Household, (household) => household.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'household_id' })
  household!: Household;

  @Column()
  name!: string;

  @Column('varchar', { name: 'primary_goal' })
  primaryGoal!: PrimaryGoal;

  @Column('integer', { name: 'daily_calories_target' })
  dailyCaloriesTarget!: number;

  @Column('integer', { name: 'max_sodium_mg' })
  maxSodiumMg!: number;

  @Column('boolean', {
    name: 'consumption_tracking_enabled',
    default: true,
  })
  consumptionTrackingEnabled!: boolean;

  @Column({ type: 'varchar', name: 'diet' })
  diet!: Diet;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => MemberAllergen, (allergen) => allergen.member)
  allergens!: MemberAllergen[];

  @OneToMany(() => MemberExcludedIngredient, (excluded) => excluded.member)
  excludedIngredients!: MemberExcludedIngredient[];
}
