import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAnalytic } from '../../entities/quiz-analytic.entity';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { ProjectsService } from '../projects/projects.service';
import type { DashboardJwtPayload } from './guards/dashboard-jwt.guard';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersSatellite)
    private readonly usersRepo: Repository<UsersSatellite>,
    @InjectRepository(QuizAnalytic)
    private readonly quizRepo: Repository<QuizAnalytic>,
    private readonly projectsService: ProjectsService,
  ) {}

  async getDashboard(payload: DashboardJwtPayload) {
    const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    const quiz = await this.quizRepo.findOne({
      where: { id: payload.qid, userId: payload.sub },
    });
    if (!quiz) {
      throw new NotFoundException('Không tìm thấy kết quả trắc nghiệm.');
    }
    const projects =
      quiz.recommendedProjectIds.length > 0
        ? await this.projectsService.findByIds(quiz.recommendedProjectIds)
        : [];

    return {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        leadSegment: user.leadSegment,
        profileScore: user.profileScore,
      },
      quiz: {
        id: quiz.id,
        createdAt: quiz.createdAt,
        calculatedScore: quiz.calculatedScore,
        recommendedProjectIds: quiz.recommendedProjectIds,
        rawData: quiz.rawData,
      },
      recommendedProjects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        province: p.province,
        district: p.district,
        kind: p.kind,
        pricePerM2: p.pricePerM2,
        typicalAreaM2: p.typicalAreaM2,
      })),
    };
  }
}
