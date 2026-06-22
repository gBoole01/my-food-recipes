import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', name: 'recipe_id' })
  recipeId!: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe?: Recipe;

  @Column('smallint')
  position!: number;

  @Column()
  name!: string;

  @Column('double precision')
  quantity!: number;

  @Column()
  unit!: string;

  @Column()
  category!: string;
}
