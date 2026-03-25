import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProjectStatus {
  UPCOMING = 'UPCOMING',
  BUILDING = 'BUILDING',
  SELLING = 'SELLING',
}

export enum ProjectKind {
  NOXH = 'NOXH',
  AFFORDABLE_COMMERCIAL = 'AFFORDABLE_COMMERCIAL',
}

@Entity('housing_projects')
export class HousingProject {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ type: 'double precision' })
  lat!: number;

  @Column({ type: 'double precision' })
  lng!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  province!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  district!: string | null;

  @Column({ name: 'price_per_m2', type: 'int' })
  pricePerM2!: number;

  @Column({ name: 'typical_area_m2', type: 'int', default: 70 })
  typicalAreaM2!: number;

  @Column({ name: 'total_units', type: 'int', nullable: true })
  totalUnits!: number | null;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.SELLING })
  status!: ProjectStatus;

  @Column({ name: 'legal_score', type: 'smallint', default: 80 })
  legalScore!: number;

  @Column({ type: 'jsonb', nullable: true })
  images!: string[] | null;

  @Column({ name: 'videos_url', type: 'jsonb', nullable: true })
  videosUrl!: string[] | null;

  @Column({ name: 'legal_info', type: 'text', nullable: true })
  legalInfo!: string | null;

  @Column({ type: 'enum', enum: ProjectKind, default: ProjectKind.NOXH })
  kind!: ProjectKind;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
