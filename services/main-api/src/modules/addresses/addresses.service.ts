import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const isFirst = (await this.prisma.userAddress.count({ where: { userId } })) === 0;

    return this.prisma.userAddress.create({
      data: {
        userId,
        label: dto.label || 'Home',
        street: dto.street,
        ward: dto.ward,
        district: dto.district,
        city: dto.city,
        country: dto.country || 'Vietnam',
        postal_code: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        fullAddress: dto.fullAddress,
        isDefault: dto.isDefault ?? isFirst,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, addressId: string) {
    const address = await this.prisma.userAddress.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Khong tim thay dia chi');
    }

    return address;
  }

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    await this.findOne(userId, addressId);

    if (dto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.street !== undefined && { street: dto.street }),
        ...(dto.ward !== undefined && { ward: dto.ward }),
        ...(dto.district !== undefined && { district: dto.district }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.postalCode !== undefined && { postal_code: dto.postalCode }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.fullAddress !== undefined && { fullAddress: dto.fullAddress }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }

  async remove(userId: string, addressId: string) {
    const address = await this.findOne(userId, addressId);

    await this.prisma.userAddress.delete({ where: { id: addressId } });

    if (address.isDefault) {
      const next = await this.prisma.userAddress.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (next) {
        await this.prisma.userAddress.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Da xoa dia chi' };
  }

  async setDefault(userId: string, addressId: string) {
    await this.findOne(userId, addressId);

    await this.prisma.userAddress.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
