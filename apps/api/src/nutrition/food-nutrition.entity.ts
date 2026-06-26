import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodCategory } from './food-category.entity';

@Entity('food_nutrition')
export class FoodNutrition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'alim_code', unique: true })
  alimCode!: string;

  @Index()
  @Column({ name: 'name_fr' })
  nameFr!: string;

  @Column({ type: 'varchar', name: 'name_scientific', nullable: true })
  nameScientific!: string | null;

  @Index()
  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => FoodCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: FoodCategory;

  @Column('double precision', { name: 'energy_kj', nullable: true })
  energyKj!: number | null;

  @Column('double precision', { name: 'energy_kcal', nullable: true })
  energyKcal!: number | null;

  @Column('double precision', { name: 'energy_jones_kj', nullable: true })
  energyJonesKj!: number | null;

  @Column('double precision', { name: 'energy_jones_kcal', nullable: true })
  energyJonesKcal!: number | null;

  @Column('double precision', { nullable: true })
  water!: number | null;

  @Column('double precision', { name: 'protein_jones', nullable: true })
  proteinJones!: number | null;

  @Column('double precision', { nullable: true })
  protein!: number | null;

  @Column('double precision', { nullable: true })
  carbohydrate!: number | null;

  @Column('double precision', { nullable: true })
  fat!: number | null;

  @Column('double precision', { name: 'sugar_total', nullable: true })
  sugarTotal!: number | null;

  @Column('double precision', { nullable: true })
  fructose!: number | null;

  @Column('double precision', { nullable: true })
  galactose!: number | null;

  @Column('double precision', { nullable: true })
  glucose!: number | null;

  @Column('double precision', { nullable: true })
  lactose!: number | null;

  @Column('double precision', { nullable: true })
  maltose!: number | null;

  @Column('double precision', { nullable: true })
  sucrose!: number | null;

  @Column('double precision', { nullable: true })
  starch!: number | null;

  @Column('double precision', { nullable: true })
  fiber!: number | null;

  @Column('double precision', { nullable: true })
  polyols!: number | null;

  @Column('double precision', { nullable: true })
  ash!: number | null;

  @Column('double precision', { nullable: true })
  alcohol!: number | null;

  @Column('double precision', { name: 'organic_acids', nullable: true })
  organicAcids!: number | null;

  @Column('double precision', { name: 'saturated_fat', nullable: true })
  saturatedFat!: number | null;

  @Column('double precision', { name: 'monounsaturated_fat', nullable: true })
  monounsaturatedFat!: number | null;

  @Column('double precision', { name: 'polyunsaturated_fat', nullable: true })
  polyunsaturatedFat!: number | null;

  @Column('double precision', { name: 'fatty_acid_4_0', nullable: true })
  fattyAcid4_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_6_0', nullable: true })
  fattyAcid6_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_8_0', nullable: true })
  fattyAcid8_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_10_0', nullable: true })
  fattyAcid10_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_12_0', nullable: true })
  fattyAcid12_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_14_0', nullable: true })
  fattyAcid14_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_16_0', nullable: true })
  fattyAcid16_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_18_0', nullable: true })
  fattyAcid18_0!: number | null;

  @Column('double precision', { name: 'fatty_acid_18_1_oleic', nullable: true })
  fattyAcid18_1Oleic!: number | null;

  @Column('double precision', { name: 'fatty_acid_18_2_linoleic', nullable: true })
  fattyAcid18_2Linoleic!: number | null;

  @Column('double precision', {
    name: 'fatty_acid_18_3_alpha_linolenic',
    nullable: true,
  })
  fattyAcid18_3AlphaLinolenic!: number | null;

  @Column('double precision', {
    name: 'fatty_acid_20_4_arachidonic',
    nullable: true,
  })
  fattyAcid20_4Arachidonic!: number | null;

  @Column('double precision', { name: 'fatty_acid_20_5_epa', nullable: true })
  fattyAcid20_5Epa!: number | null;

  @Column('double precision', { name: 'fatty_acid_22_6_dha', nullable: true })
  fattyAcid22_6Dha!: number | null;

  @Column('double precision', { nullable: true })
  cholesterol!: number | null;

  @Column('double precision', { nullable: true })
  salt!: number | null;

  @Column('double precision', { nullable: true })
  calcium!: number | null;

  @Column('double precision', { nullable: true })
  chloride!: number | null;

  @Column('double precision', { nullable: true })
  copper!: number | null;

  @Column('double precision', { nullable: true })
  iron!: number | null;

  @Column('double precision', { nullable: true })
  iodine!: number | null;

  @Column('double precision', { nullable: true })
  magnesium!: number | null;

  @Column('double precision', { nullable: true })
  manganese!: number | null;

  @Column('double precision', { nullable: true })
  phosphorus!: number | null;

  @Column('double precision', { nullable: true })
  potassium!: number | null;

  @Column('double precision', { nullable: true })
  selenium!: number | null;

  @Column('double precision', { nullable: true })
  sodium!: number | null;

  @Column('double precision', { nullable: true })
  zinc!: number | null;

  @Column('double precision', { name: 'vitamin_a_rae', nullable: true })
  vitaminARae!: number | null;

  @Column('double precision', { nullable: true })
  retinol!: number | null;

  @Column('double precision', { name: 'beta_carotene', nullable: true })
  betaCarotene!: number | null;

  @Column('double precision', { name: 'vitamin_d', nullable: true })
  vitaminD!: number | null;

  @Column('double precision', { name: 'vitamin_d2', nullable: true })
  vitaminD2!: number | null;

  @Column('double precision', { name: 'vitamin_d3', nullable: true })
  vitaminD3!: number | null;

  @Column('double precision', { name: 'alpha_tocopherol', nullable: true })
  alphaTocopherol!: number | null;

  @Column('double precision', { name: 'vitamin_e', nullable: true })
  vitaminE!: number | null;

  @Column('double precision', { name: 'vitamin_k1', nullable: true })
  vitaminK1!: number | null;

  @Column('double precision', { name: 'vitamin_k2', nullable: true })
  vitaminK2!: number | null;

  @Column('double precision', { name: 'vitamin_c', nullable: true })
  vitaminC!: number | null;

  @Column('double precision', { name: 'vitamin_b1', nullable: true })
  vitaminB1!: number | null;

  @Column('double precision', { name: 'vitamin_b2', nullable: true })
  vitaminB2!: number | null;

  @Column('double precision', { name: 'vitamin_b3', nullable: true })
  vitaminB3!: number | null;

  @Column('double precision', { name: 'vitamin_b5', nullable: true })
  vitaminB5!: number | null;

  @Column('double precision', { name: 'vitamin_b6', nullable: true })
  vitaminB6!: number | null;

  @Column('double precision', { name: 'vitamin_b9_dfe', nullable: true })
  vitaminB9Dfe!: number | null;

  @Column('double precision', { name: 'vitamin_b9', nullable: true })
  vitaminB9!: number | null;

  @Column('double precision', { name: 'folates_intrinsic', nullable: true })
  folatesIntrinsic!: number | null;

  @Column('double precision', {
    name: 'folic_acid_fortification',
    nullable: true,
  })
  folicAcidFortification!: number | null;

  @Column('double precision', { name: 'vitamin_b12', nullable: true })
  vitaminB12!: number | null;

  @Column({ type: 'varchar', name: 'jones_factor', nullable: true })
  jonesFactor!: string | null;
}
