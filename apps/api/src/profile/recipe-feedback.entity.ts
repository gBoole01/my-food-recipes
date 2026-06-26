import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { MemberProfile } from './member-profile.entity';

export type RecipeFeedbackVote = 'like' | 'dislike';

@Entity('recipe_feedbacks')
export class RecipeFeedback {
  @PrimaryColumn('uuid', { name: 'member_id' })
  memberId!: string;

  @PrimaryColumn('uuid', { name: 'recipe_id' })
  recipeId!: string;

  @ManyToOne(() => MemberProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member!: MemberProfile;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe!: Recipe;

  @Column('varchar')
  vote!: RecipeFeedbackVote;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
