import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { QuizAnalytic } from '../../entities/quiz-analytic.entity';
import { LarkBaseService } from '../lark/lark-base.service';
import { ProjectsService } from '../projects/projects.service';
import { evaluateEligibility } from './eligibility-engine';
import type { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class EligibilityService {
  constructor(
    @InjectRepository(UsersSatellite)
    private readonly usersRepo: Repository<UsersSatellite>,
    private readonly projectsService: ProjectsService,
    private readonly jwt: JwtService,
    private readonly lark: LarkBaseService,
  ) {}

  async submit(dto: SubmitQuizDto) {
    const uniqueIds = [...new Set(dto.priorityProjectIds)];
    const projects = await this.projectsService.findByIds(uniqueIds);
    if (uniqueIds.length > 0 && projects.length !== uniqueIds.length) {
      throw new BadRequestException('Một hoặc nhiều dự án ưu tiên không tồn tại trong hệ thống.');
    }

    const answers = {
      priorityGroup: dto.priorityGroup,
      residenceStatus: dto.residenceStatus,
      incomeBracket: dto.incomeBracket,
      housingStatus: dto.housingStatus,
      priorityProjectIds: uniqueIds,
      ownCapitalMillion: dto.ownCapitalMillion,
      borrowedCapitalMillion: dto.borrowedCapitalMillion,
      loanPreference: dto.loanPreference,
      maxMonthlyPaymentMillion: dto.maxMonthlyPaymentMillion,
      consultationFocus: dto.consultationFocus,
    };

    const { segment, score, userMessage } = evaluateEligibility(answers, projects);
    const phone = dto.phone.replace(/\s/g, '');
    const rawData = { ...dto, priorityProjectIds: uniqueIds } as Record<string, unknown>;

    const { user, quiz } = await this.usersRepo.manager.transaction(async (em) => {
      const users = em.getRepository(UsersSatellite);
      const quizzes = em.getRepository(QuizAnalytic);

      let user = await users.findOne({ where: { phoneNumber: phone } });
      if (!user) {
        user = users.create({
          phoneNumber: phone,
          email: dto.email,
          fullName: dto.fullName ?? null,
          salutation: dto.salutation ?? null,
          leadSegment: segment,
          profileScore: score,
          superappUid: null,
        });
      } else {
        user.email = dto.email;
        if (dto.fullName) {
          user.fullName = dto.fullName;
        }
        if (dto.salutation) {
          user.salutation = dto.salutation;
        }
        user.leadSegment = segment;
        user.profileScore = score;
      }
      await users.save(user);

      const quiz = quizzes.create({
        userId: user.id,
        rawData,
        calculatedScore: score,
        recommendedProjectIds: uniqueIds,
      });
      await quizzes.save(quiz);

      return { user, quiz };
    });

    const dashboardToken = this.jwt.sign({ sub: user.id, qid: quiz.id });

    void this.lark.pushQuizLead({
      userId: user.id,
      quizId: quiz.id,
      phone: user.phoneNumber,
      email: user.email,
      leadSegment: segment,
      score,
      quizJson: JSON.stringify(rawData),
      source: 'web',
    });

    return {
      segment,
      score,
      userMessage,
      recommendedProjectIds: uniqueIds,
      userId: user.id,
      quizId: quiz.id,
      dashboardToken,
    };
  }
}
