import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('micronutrient_targets')
@Unique(['gender', 'ageMin', 'ageMax', 'specialCondition'])
export class MicronutrientTarget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  gender!: 'M' | 'F' | 'any';

  @Column('smallint', { name: 'age_min' })
  ageMin!: number;

  @Column('smallint', { name: 'age_max' })
  ageMax!: number;

  @Column('varchar', { name: 'special_condition', nullable: true })
  specialCondition!: string | null;

  @Column('double precision', { name: 'fiber_g' })
  fiberG!: number;

  @Column('double precision', { name: 'iron_mg' })
  ironMg!: number;

  @Column('double precision', { name: 'calcium_mg' })
  calciumMg!: number;

  @Column('double precision', { name: 'magnesium_mg' })
  magnesiumMg!: number;

  @Column('double precision', { name: 'vitamin_c_mg' })
  vitaminCMg!: number;
}
