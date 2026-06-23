import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MemberProfile } from './member-profile.entity';

@Entity('member_excluded_ingredients')
export class MemberExcludedIngredient {
  @PrimaryColumn('uuid', { name: 'member_id' })
  memberId!: string;

  @PrimaryColumn({ name: 'ingredient_name' })
  ingredientName!: string;

  @ManyToOne(() => MemberProfile, (member) => member.excludedIngredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member!: MemberProfile;
}
