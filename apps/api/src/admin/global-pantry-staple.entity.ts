import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('global_pantry_staples')
export class GlobalPantryStaple {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;
}
