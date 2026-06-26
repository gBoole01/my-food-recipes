import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberProfile } from './member-profile.entity';

export type ExclusionType = 'ingredient' | 'category' | 'allergen';

@Entity('member_category_exclusions')
export class MemberCategoryExclusion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid', { name: 'member_id' })
  memberId!: string;

  @ManyToOne(() => MemberProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member!: MemberProfile;

  @Column('varchar', { name: 'exclusion_type' })
  exclusionType!: ExclusionType;

  @Column('varchar', { name: 'target_value' })
  targetValue!: string;
}
