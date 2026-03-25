import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalListing } from '../../entities/rental-listing.entity';
import { RentalListingReport } from '../../entities/rental-listing-report.entity';

/**
 * Kênh nhà trọ — API public/landlord sẽ thêm ở R3/R4.
 */
@Module({
  imports: [TypeOrmModule.forFeature([RentalListing, RentalListingReport])],
  exports: [TypeOrmModule],
})
export class RentalModule {}
