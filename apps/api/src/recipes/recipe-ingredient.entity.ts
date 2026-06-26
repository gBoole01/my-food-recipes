import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngredientAlias } from '../nutrition/ingredient-alias.entity';
import { Recipe } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'recipe_id' })
  recipeId!: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe?: Recipe;

  @Index()
  @Column({ type: 'uuid', name: 'alias_id', nullable: true })
  aliasId!: string | null;

  @ManyToOne(() => IngredientAlias, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'alias_id' })
  alias?: IngredientAlias;

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
