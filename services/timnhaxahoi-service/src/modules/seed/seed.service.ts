import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  HousingProject,
  ProjectKind,
  ProjectStatus,
} from '../../entities/housing-project.entity';

const SEED_PROJECTS: Array<
  Pick<
    HousingProject,
    | 'name'
    | 'slug'
    | 'lat'
    | 'lng'
    | 'province'
    | 'district'
    | 'pricePerM2'
    | 'typicalAreaM2'
    | 'totalUnits'
    | 'status'
    | 'legalScore'
    | 'kind'
  >
> = [
  {
    name: 'NOXH Bình Dương — Khu mẫu A',
    slug: 'noxh-binh-duong-khu-mau-a',
    lat: 10.98,
    lng: 106.67,
    province: 'Bình Dương',
    district: 'Thuận An',
    pricePerM2: 18_500_000,
    typicalAreaM2: 70,
    totalUnits: 800,
    status: ProjectStatus.SELLING,
    legalScore: 88,
    kind: ProjectKind.NOXH,
  },
  {
    name: 'NOXH Đồng Nai — An Cư 2',
    slug: 'noxh-dong-nai-an-cu-2',
    lat: 10.95,
    lng: 106.82,
    province: 'Đồng Nai',
    district: 'Biên Hòa',
    pricePerM2: 17_200_000,
    typicalAreaM2: 68,
    totalUnits: 650,
    status: ProjectStatus.BUILDING,
    legalScore: 85,
    kind: ProjectKind.NOXH,
  },
  {
    name: 'NOXH Long An — Riverside',
    slug: 'noxh-long-an-riverside',
    lat: 10.53,
    lng: 106.41,
    province: 'Long An',
    district: 'Bến Lức',
    pricePerM2: 16_800_000,
    typicalAreaM2: 72,
    totalUnits: 520,
    status: ProjectStatus.SELLING,
    legalScore: 82,
    kind: ProjectKind.NOXH,
  },
  {
    name: 'Căn hộ TM giá mềm — Tây Ninh Gateway (mẫu)',
    slug: 'can-ho-tm-tay-ninh-gateway-mau',
    lat: 11.31,
    lng: 106.1,
    province: 'Tây Ninh',
    district: 'Tây Ninh',
    pricePerM2: 22_000_000,
    typicalAreaM2: 55,
    totalUnits: 200,
    status: ProjectStatus.SELLING,
    legalScore: 75,
    kind: ProjectKind.AFFORDABLE_COMMERCIAL,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(HousingProject)
    private readonly repo: Repository<HousingProject>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Production: schema comes from migrations only (synchronize: false). Querying before
    // migration:run would throw and crash the API → unhealthy container.
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    const count = await this.repo.count();
    if (count > 0) {
      return;
    }
    for (const row of SEED_PROJECTS) {
      await this.repo.save(this.repo.create({ ...row, images: [], videosUrl: [], legalInfo: null }));
    }
    this.logger.log(`Seeded ${SEED_PROJECTS.length} housing projects (dev empty DB).`);
  }
}
