import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RentalListing } from './rental-listing.entity';
import { UsersSatellite } from './users-satellite.entity';

export enum RentalReportStatus {
  OPEN = 'OPEN',
  REVIEWED = 'REVIEWED',
  DISMISSED = 'DISMISSED',
}

@Entity('rental_listing_reports')
@Index('IDX_rental_reports_listing', ['listingId'])
@Index('IDX_rental_reports_status', ['status'])
export class RentalListingReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId!: string;

  @ManyToOne(() => RentalListing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing!: RentalListing;

  @Column({ name: 'reporter_user_id', type: 'uuid', nullable: true })
  reporterUserId!: string | null;

  @ManyToOne(() => UsersSatellite, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reporter_user_id' })
  reporter!: UsersSatellite | null;

  @Column({ type: 'varchar', length: 500 })
  reason!: string;

  @Column({
    type: 'enum',
    enum: RentalReportStatus,
    enumName: 'rental_listing_reports_status_enum',
    default: RentalReportStatus.OPEN,
  })
  status!: RentalReportStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
