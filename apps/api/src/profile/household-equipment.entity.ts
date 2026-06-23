import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Household } from './household.entity';

@Entity('household_equipments')
export class HouseholdEquipment {
  @PrimaryColumn('uuid', { name: 'household_id' })
  householdId!: string;

  @PrimaryColumn({ name: 'equipment_name' })
  equipmentName!: string;

  @ManyToOne(() => Household, (household) => household.equipment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'household_id' })
  household!: Household;
}
