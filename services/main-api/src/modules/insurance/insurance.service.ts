import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PurchasePolicyDto,
  FileClaimDto,
  InsuranceProductQueryDto,
  PolicyQueryDto,
} from './dto/insurance.dto';

@Injectable()
export class InsuranceService {
  constructor(private readonly prisma: PrismaService) {}

  private async generatePolicyNumber(): Promise<string> {
    const count = await this.prisma.insurancePolicy.count();
    return `LS-INS-${String(count + 1).padStart(6, '0')}`;
  }

  private async generateClaimNumber(): Promise<string> {
    const count = await this.prisma.insuranceClaim.count();
    return `LS-CLM-${String(count + 1).padStart(6, '0')}`;
  }

  // ═══ PRODUCTS (Sản phẩm bảo hiểm) ════════════════════════════════════════

  async listProducts(query: InsuranceProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { isActive: true };
    if (query.type) where.type = query.type;

    const [products, total] = await Promise.all([
      this.prisma.insuranceProduct.findMany({
        where,
        orderBy: { premiumMonthly: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.insuranceProduct.count({ where }),
    ]);

    return {
      data: products.map((p) => this.formatProduct(p)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProduct(productId: string) {
    const product = await this.prisma.insuranceProduct.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Sản phẩm bảo hiểm không tồn tại');
    return this.formatProduct(product);
  }

  // ═══ POLICIES (Hợp đồng bảo hiểm) ════════════════════════════════════════

  async purchasePolicy(userId: string, dto: PurchasePolicyDto) {
    const product = await this.prisma.insuranceProduct.findUnique({
      where: { id: dto.productId },
    });
    if (!product || !product.isActive) {
      throw new BadRequestException('Sản phẩm bảo hiểm không khả dụng');
    }

    const premiumAmount =
      dto.paymentPeriod === 'monthly' ? product.premiumMonthly : product.premiumYearly;

    const startDate = new Date(dto.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + product.termMonths);

    const policyNumber = await this.generatePolicyNumber();

    const policy = await this.prisma.insurancePolicy.create({
      data: {
        policyNumber,
        userId,
        productId: dto.productId,
        status: 'PENDING',
        premiumAmount,
        coverageAmount: product.coverageAmount,
        currency: product.currency,
        startDate,
        endDate,
        beneficiaryName: dto.beneficiaryName || null,
        beneficiaryPhone: dto.beneficiaryPhone || null,
      },
      include: { product: true },
    });

    return this.formatPolicy(policy);
  }

  async getMyPolicies(userId: string, query: PolicyQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { userId };
    if (query.status) where.status = query.status;

    const [policies, total] = await Promise.all([
      this.prisma.insurancePolicy.findMany({
        where,
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.insurancePolicy.count({ where }),
    ]);

    return {
      data: policies.map((p) => this.formatPolicy(p)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPolicyDetail(policyId: string, userId: string) {
    const policy = await this.prisma.insurancePolicy.findUnique({
      where: { id: policyId },
      include: { product: true, claims: { orderBy: { createdAt: 'desc' } } },
    });
    if (!policy || policy.userId !== userId) {
      throw new NotFoundException('Không tìm thấy hợp đồng bảo hiểm');
    }
    return this.formatPolicy(policy);
  }

  // ═══ CLAIMS (Yêu cầu bồi thường) ═════════════════════════════════════════

  async fileClaim(userId: string, dto: FileClaimDto) {
    const policy = await this.prisma.insurancePolicy.findUnique({
      where: { id: dto.policyId },
    });
    if (!policy || policy.userId !== userId) {
      throw new NotFoundException('Không tìm thấy hợp đồng bảo hiểm');
    }
    if (policy.status !== 'ACTIVE') {
      throw new BadRequestException('Hợp đồng không ở trạng thái hoạt động');
    }
    if (BigInt(dto.claimAmount) > policy.coverageAmount) {
      throw new BadRequestException(
        `Số tiền yêu cầu vượt quá mức bảo hiểm ${Number(policy.coverageAmount).toLocaleString()} VND`,
      );
    }

    const claimNumber = await this.generateClaimNumber();

    const claim = await this.prisma.insuranceClaim.create({
      data: {
        claimNumber,
        policyId: dto.policyId,
        userId,
        status: 'SUBMITTED',
        claimAmount: dto.claimAmount,
        reason: dto.reason,
        description: dto.description || null,
        documents: dto.documents || [],
      },
    });

    return this.formatClaim(claim);
  }

  async getMyClaims(userId: string) {
    const claims = await this.prisma.insuranceClaim.findMany({
      where: { userId },
      include: { policy: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return claims.map((c) => this.formatClaim(c));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private formatProduct(p: any) {
    return {
      id: p.id,
      productCode: p.productCode,
      name: p.name,
      type: p.type,
      provider: p.provider,
      description: p.description,
      coverageDetails: p.coverageDetails,
      premiumMonthly: Number(p.premiumMonthly),
      premiumYearly: Number(p.premiumYearly),
      coverageAmount: Number(p.coverageAmount),
      currency: p.currency,
      termMonths: p.termMonths,
      minAge: p.minAge,
      maxAge: p.maxAge,
    };
  }

  private formatPolicy(p: any) {
    return {
      id: p.id,
      policyNumber: p.policyNumber,
      status: p.status,
      premiumAmount: Number(p.premiumAmount),
      coverageAmount: Number(p.coverageAmount),
      currency: p.currency,
      startDate: p.startDate,
      endDate: p.endDate,
      beneficiaryName: p.beneficiaryName,
      beneficiaryPhone: p.beneficiaryPhone,
      product: p.product ? this.formatProduct(p.product) : undefined,
      claims: p.claims?.map((c: any) => this.formatClaim(c)),
      createdAt: p.createdAt,
    };
  }

  private formatClaim(c: any) {
    return {
      id: c.id,
      claimNumber: c.claimNumber,
      status: c.status,
      claimAmount: Number(c.claimAmount),
      approvedAmount: c.approvedAmount ? Number(c.approvedAmount) : null,
      currency: c.currency,
      reason: c.reason,
      description: c.description,
      documents: c.documents,
      reviewNote: c.reviewNote,
      reviewedAt: c.reviewedAt,
      paidAt: c.paidAt,
      createdAt: c.createdAt,
      policy: c.policy ? this.formatPolicy({ ...c.policy, claims: undefined }) : undefined,
    };
  }
}
