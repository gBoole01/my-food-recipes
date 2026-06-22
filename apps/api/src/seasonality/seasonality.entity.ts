import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export type SeasonalityType = 'fruit' | 'legume';

@Entity('seasonality')
@Unique(['name', 'month'])
export class Seasonality {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('smallint')
  month!: number;

  @Column({ type: 'varchar' })
  type!: SeasonalityType;

  @Column()
  name!: string;
}
