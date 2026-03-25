import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousingProject } from '../../entities/housing-project.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([HousingProject])],
  providers: [SeedService],
})
export class SeedModule {}
