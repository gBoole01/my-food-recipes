import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MemberProfile } from './member-profile.entity';

@Entity('member_allergens')
export class MemberAllergen {
  @PrimaryColumn('uuid', { name: 'member_id' })
  memberId!: string;

  @PrimaryColumn()
  allergen!: string;

  @ManyToOne(() => MemberProfile, (member) => member.allergens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member!: MemberProfile;
}
