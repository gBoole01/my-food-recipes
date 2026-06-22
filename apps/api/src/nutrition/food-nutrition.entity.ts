import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('food_nutrition')
export class FoodNutrition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'nutrient_data_bank_number', unique: true })
  nutrientDataBankNumber!: string;

  @Column()
  category!: string;

  @Column()
  description!: string;

  @Column('double precision', { nullable: true })
  alphaCarotene!: number | null;

  @Column('double precision', { nullable: true })
  betaCarotene!: number | null;

  @Column('double precision', { nullable: true })
  betaCryptoxanthin!: number | null;

  @Column('double precision', { nullable: true })
  carbohydrate!: number | null;

  @Column('double precision', { nullable: true })
  cholesterol!: number | null;

  @Column('double precision', { nullable: true })
  choline!: number | null;

  @Column('double precision', { nullable: true })
  fiber!: number | null;

  @Column('double precision', { nullable: true })
  luteinZeaxanthin!: number | null;

  @Column('double precision', { nullable: true })
  lycopene!: number | null;

  @Column('double precision', { nullable: true })
  niacin!: number | null;

  @Column('double precision', { nullable: true })
  protein!: number | null;

  @Column('double precision', { nullable: true })
  retinol!: number | null;

  @Column('double precision', { nullable: true })
  riboflavin!: number | null;

  @Column('double precision', { nullable: true })
  selenium!: number | null;

  @Column('double precision', { nullable: true })
  sugarTotal!: number | null;

  @Column('double precision', { nullable: true })
  thiamin!: number | null;

  @Column('double precision', { nullable: true })
  water!: number | null;

  @Column('double precision', { nullable: true })
  monounsaturatedFat!: number | null;

  @Column('double precision', { nullable: true })
  polyunsaturatedFat!: number | null;

  @Column('double precision', { nullable: true })
  saturatedFat!: number | null;

  @Column('double precision', { nullable: true })
  totalLipid!: number | null;

  @Column('double precision', { nullable: true })
  calcium!: number | null;

  @Column('double precision', { nullable: true })
  copper!: number | null;

  @Column('double precision', { nullable: true })
  iron!: number | null;

  @Column('double precision', { nullable: true })
  magnesium!: number | null;

  @Column('double precision', { nullable: true })
  phosphorus!: number | null;

  @Column('double precision', { nullable: true })
  potassium!: number | null;

  @Column('double precision', { nullable: true })
  sodium!: number | null;

  @Column('double precision', { nullable: true })
  zinc!: number | null;

  @Column('double precision', { nullable: true })
  vitaminARae!: number | null;

  @Column('double precision', { nullable: true })
  vitaminB12!: number | null;

  @Column('double precision', { nullable: true })
  vitaminB6!: number | null;

  @Column('double precision', { nullable: true })
  vitaminC!: number | null;

  @Column('double precision', { nullable: true })
  vitaminE!: number | null;

  @Column('double precision', { nullable: true })
  vitaminK!: number | null;
}
