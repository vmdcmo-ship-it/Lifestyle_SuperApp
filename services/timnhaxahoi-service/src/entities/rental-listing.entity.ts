import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersSatellite } from './users-satellite.entity';

/**
 * Tin nhà trọ — tách bảng `housing_projects` (§12.5).
 * TTL/ẩn SĐT/ẩn tin public: §19.8 — logic xử lý ở service (không tin client).
 */
@Entity('rental_listings')
@Index('IDX_rental_listings_owner', ['ownerUserId'])
@Index('IDX_rental_listings_province_district', ['province', 'district'])
@Index('IDX_rental_listings_expires', ['expiresAt'])
@Index('IDX_rental_listings_visible_public', ['visiblePublic'])
export class RentalListing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId!: string;

  @ManyToOne(() => UsersSatellite, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_user_id' })
  owner!: UsersSatellite;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  province!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  district!: string | null;

  @Column({ name: 'address_line', type: 'text', nullable: true })
  addressLine!: string | null;

  @Column({ type: 'double precision', nullable: true })
  lat!: number | null;

  @Column({ type: 'double precision', nullable: true })
  lng!: number | null;

  /** Giá thuê / tháng (VND). */
  @Column({ name: 'price_monthly', type: 'int' })
  priceMonthly!: number;

  @Column({ name: 'area_m2', type: 'int', nullable: true })
  areaM2!: number | null;

  /** SĐT hiển thị khi tin còn hạn (API public strip khi hết hạn — §19.8). */
  @Column({ name: 'contact_phone', type: 'varchar', length: 32 })
  contactPhone!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  /**
   * `false` khi tin đã ẩn hoàn toàn khỏi public (vd. sau 30 ngày hết hạn không gia hạn — §19.8).
   * Trạng thái “hết hạn nhưng vẫn xem được (không SĐT)” do API suy ra từ `expiresAt` vs `now`.
   */
  @Column({ name: 'visible_public', type: 'boolean', default: true })
  visiblePublic!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
