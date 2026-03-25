import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersSatellite } from '../../entities/users-satellite.entity';
import type { AuthSyncJwtPayload } from './auth-sync-jwt.types';
import type { AuthSyncDto } from './dto/auth-sync.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersSatellite)
    private readonly usersRepo: Repository<UsersSatellite>,
  ) {}

  async sync(dto: AuthSyncDto, assertion?: AuthSyncJwtPayload) {
    if (assertion) {
      this.validateDtoAgainstAssertion(dto, assertion);
    }

    const phone = dto.phone.replace(/\s/g, '');
    const effectiveSuperappUid = assertion?.sub ?? dto.superappUid;
    const fullName =
      dto.fullName?.trim() || assertion?.full_name?.trim() || undefined;

    const byUid = effectiveSuperappUid
      ? await this.usersRepo.findOne({ where: { superappUid: effectiveSuperappUid } })
      : null;
    const byPhone = await this.usersRepo.findOne({ where: { phoneNumber: phone } });

    if (byUid && byPhone && byUid.id !== byPhone.id) {
      throw new BadRequestException(
        'superappUid và số điện thoại đang trỏ tới hai tài khoản khác nhau; cần xử lý thủ công.',
      );
    }

    let user = byUid ?? byPhone;
    if (!user) {
      user = this.usersRepo.create({
        phoneNumber: phone,
        email: dto.email,
        fullName: fullName ?? null,
        superappUid: effectiveSuperappUid ?? null,
        leadSegment: null,
        profileScore: null,
      });
    } else {
      if (effectiveSuperappUid) {
        const uidOwner = await this.usersRepo.findOne({
          where: { superappUid: effectiveSuperappUid },
        });
        if (uidOwner && uidOwner.id !== user.id) {
          throw new BadRequestException('superappUid đã gắn với tài khoản khác.');
        }
        user.superappUid = effectiveSuperappUid;
      }
      user.phoneNumber = phone;
      user.email = dto.email;
      if (fullName) {
        user.fullName = fullName;
      }
    }

    const phoneOwner = await this.usersRepo.findOne({ where: { phoneNumber: phone } });
    if (phoneOwner && phoneOwner.id !== user.id) {
      throw new BadRequestException('Số điện thoại đã gắn với tài khoản khác.');
    }

    await this.usersRepo.save(user);
    return { userId: user.id, synced: true };
  }

  private validateDtoAgainstAssertion(dto: AuthSyncDto, a: AuthSyncJwtPayload): void {
    const phone = dto.phone.replace(/\s/g, '');
    const ap = a.phone.replace(/\s/g, '');
    if (phone !== ap) {
      throw new BadRequestException('Số điện thoại không khớp assertion JWT.');
    }
    if (dto.email.toLowerCase().trim() !== a.email.toLowerCase().trim()) {
      throw new BadRequestException('Email không khớp assertion JWT.');
    }
    if (dto.superappUid != null && dto.superappUid !== a.sub) {
      throw new BadRequestException('superappUid không khớp assertion (sub).');
    }
    const df = dto.fullName?.trim();
    const af = a.full_name?.trim();
    if (df && af && df !== af) {
      throw new BadRequestException('Họ tên không khớp assertion JWT.');
    }
  }
}
