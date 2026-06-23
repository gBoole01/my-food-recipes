import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HouseholdEquipment } from './household-equipment.entity';
import { HouseholdPantryStaple } from './household-pantry-staple.entity';
import { MemberProfile } from './member-profile.entity';

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => MemberProfile, (member) => member.household)
  members!: MemberProfile[];

  @OneToMany(() => HouseholdEquipment, (equipment) => equipment.household)
  equipment!: HouseholdEquipment[];

  @OneToMany(() => HouseholdPantryStaple, (staple) => staple.household)
  pantryStaples!: HouseholdPantryStaple[];
}
