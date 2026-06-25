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

  @Column({ type: 'varchar', name: 'diet' })
  diet!: Diet;

  @Column({ type: 'varchar', nullable: true, name: 'gender' })
  gender?: string | null;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate?: string | null;

  @Column({ type: 'float', nullable: true, name: 'weight_kg' })
  weightKg?: number | null;

  @Column({ type: 'float', nullable: true, name: 'height_cm' })
  heightCm?: number | null;

  @Column({ type: 'float', nullable: true, name: 'sitting_hours' })
  sittingHours?: number | null;

  @Column({ type: 'float', nullable: true, name: 'standing_light_hours' })
  standingLightHours?: number | null;

  @Column({ type: 'float', nullable: true, name: 'moderate_sport_hours' })
  moderateSportHours?: number | null;

  @Column({ type: 'float', nullable: true, name: 'intense_sport_hours' })
  intenseSportHours?: number | null;

  @Column({ type: 'varchar', nullable: true, name: 'special_condition' })
  specialCondition?: string | null;

  @Column({ type: 'integer', nullable: true, name: 'pregnancy_trimester' })
  pregnancyTrimester?: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => MemberAllergen, (allergen) => allergen.member)
  allergens!: MemberAllergen[];

  @OneToMany(() => MemberExcludedIngredient, (excluded) => excluded.member)
  excludedIngredients!: MemberExcludedIngredient[];
}
