import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { HousingProject } from '../entities/housing-project.entity';
import { QuizAnalytic } from '../entities/quiz-analytic.entity';
import { RentalListing } from '../entities/rental-listing.entity';
import { RentalListingReport } from '../entities/rental-listing-report.entity';
import { UsersSatellite } from '../entities/users-satellite.entity';

config({ path: ['.env.local', '.env'] });

/** Dùng sau `nest build`: `pnpm migration:run` (xem package.json). */
export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'timnhaxahoi',
  entities: [HousingProject, QuizAnalytic, UsersSatellite, RentalListing, RentalListingReport],
  migrations: [join(__dirname, 'migrations', '*.js')],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
