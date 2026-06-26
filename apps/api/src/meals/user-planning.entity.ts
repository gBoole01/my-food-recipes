import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_planning')
export class UserPlanning {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'household_id' })
  householdId!: string;

  @Column('uuid', { name: 'member_id', nullable: true })
  memberId!: string | null;

  @Index()
  @Column('uuid', { name: 'recipe_id' })
  recipeId!: string;

  @Column({ type: 'date', name: 'date_repas' })
  dateRepas!: string;

  @Column('varchar')
  creneau!: string;

  @Column('smallint')
  couverts!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
