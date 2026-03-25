import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAnalytic } from '../../entities/quiz-analytic.entity';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import { LarkBaseService } from '../lark/lark-base.service';
import type { DashboardJwtPayload } from '../user/guards/dashboard-jwt.guard';
import type { ConvertLeadDto } from './dto/convert-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(UsersSatellite)
    private readonly usersRepo: Repository<UsersSatellite>,
    @InjectRepository(QuizAnalytic)
    private readonly quizRepo: Repository<QuizAnalytic>,
    private readonly lark: LarkBaseService,
  ) {}

  async convert(payload: DashboardJwtPayload, dto: ConvertLeadDto) {
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

    await this.lark.notifyDeepConsultation({
      userId: user.id,
      quizId: quiz.id,
      phone: user.phoneNumber,
      email: user.email,
      leadSegment: user.leadSegment,
      score: user.profileScore,
      note: dto.note ?? null,
    });

    return {
      ok: true,
      larkRecorded: this.lark.isEnabled,
    };
  }
}
