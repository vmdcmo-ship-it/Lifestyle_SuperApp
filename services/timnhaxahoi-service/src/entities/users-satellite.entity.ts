import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeadSegment } from './lead-segment.enum';
import { QuizAnalytic } from './quiz-analytic.entity';

@Entity('users_satellite')
export class UsersSatellite {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'superapp_uid', type: 'varchar', length: 128, nullable: true, unique: true })
  superappUid!: string | null;

  @Index({ unique: true })
  @Column({ name: 'phone_number', type: 'varchar', length: 32 })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName!: string | null;

  @Column({ name: 'lead_segment', type: 'enum', enum: LeadSegment, nullable: true })
  leadSegment!: LeadSegment | null;

  @Column({ name: 'profile_score', type: 'smallint', nullable: true })
  profileScore!: number | null;

  @OneToMany(() => QuizAnalytic, (q) => q.user)
  quizzes!: QuizAnalytic[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
