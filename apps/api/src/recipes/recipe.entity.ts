import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';

export type RecipeStatus = 'draft' | 'test' | 'published';

@Entity('recipes')
export class Recipe {
  @PrimaryColumn('varchar')
  id!: string;

  @Column()
  name!: string;

  @Column('smallint')
  servings!: number;

  @Column('text', { array: true, name: 'diet_tags' })
  dietTags!: string[];

  @Column('text', { array: true })
  allergens!: string[];

  @Column('text', { array: true, name: 'required_appliances' })
  requiredAppliances!: string[];

  @Column('smallint', { name: 'prep_time_minutes' })
  prepTimeMinutes!: number;

  @Column('smallint', { name: 'cook_time_minutes' })
  cookTimeMinutes!: number;

  @Column('double precision')
  calories!: number;

  @Column('double precision')
  protein!: number;

  @Column('double precision')
  carbs!: number;

  @Column('double precision')
  fat!: number;

  @Column('text', { array: true })
  steps!: string[];

  @Column({ type: 'varchar', default: 'published' })
  status!: RecipeStatus;

  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe)
  ingredients!: RecipeIngredient[];
}
