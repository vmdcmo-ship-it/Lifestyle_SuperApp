import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersSatellite } from './users-satellite.entity';

@Entity('quiz_analytic')
export class QuizAnalytic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UsersSatellite, (u) => u.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UsersSatellite;

  @Column({ name: 'raw_data', type: 'jsonb' })
  rawData!: Record<string, unknown>;

  @Column({ name: 'calculated_score', type: 'smallint' })
  calculatedScore!: number;

  @Column({ name: 'recommended_project_ids', type: 'jsonb' })
  recommendedProjectIds!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
