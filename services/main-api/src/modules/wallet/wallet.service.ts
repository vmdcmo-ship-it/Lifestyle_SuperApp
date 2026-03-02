import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  TopUpDto,
  PaymentDto,
  TransferDto,
  WithdrawDto,
  TransactionQueryDto,
} from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateWalletNumber(): Promise<string> {
    const count = await this.prisma.wallet.count();
    return `LS-W-${String(count + 1).padStart(8, '0')}`;
  }

  private generateTransactionRef(type: string): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LS-TX-${type.substring(0, 3)}-${ts}-${rand}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET OR CREATE WALLET
  // ═══════════════════════════════════════════════════════════════════════════

  async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      const walletNumber = await this.generateWalletNumber();
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          walletNumber,
          balance: 0,
          status: 'ACTIVE',
          currency: 'VND',
        },
      });
    }

    return this.formatWallet(wallet);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TOP UP (nap tien)
  // ═══════════════════════════════════════════════════════════════════════════

  async topUp(userId: string, dto: TopUpDto) {
    const wallet = await this.ensureActiveWallet(userId);

    const dailyUsed = Number(wallet.daily_top_up_used);
    const dailyLimit = Number(wallet.daily_top_up_limit);
    if (dailyUsed + dto.amount > dailyLimit) {
      throw new BadRequestException(
        `Vuot han muc nap trong ngay. Con lai: ${dailyLimit - dailyUsed} VND`,
      );
    }

    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + dto.amount;
    const txRef = this.generateTransactionRef('TOP');

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          transactionRef: txRef,
          walletId: wallet.id,
          user_id: userId,
          type: 'TOP_UP',
          status: 'COMPLETED',
          amount: dto.amount,
          fee: 0,
          net_amount: dto.amount,
          currency: 'VND',
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          payment_method: dto.method as any,
          description: `Nap ${dto.amount.toLocaleString()} VND qua ${dto.method}`,
          note: dto.note || null,
          completed_at: new Date(),
        },
      }),
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          daily_top_up_used: { increment: dto.amount },
          total_top_up: { increment: dto.amount },
        },
      }),
    ]);

    return {
      transaction: this.formatTransaction(transaction),
      wallet: { balance: balanceAfter, currency: 'VND' },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYMENT (thanh toan)
  // ═══════════════════════════════════════════════════════════════════════════

  async pay(userId: string, dto: PaymentDto) {
    const wallet = await this.ensureActiveWallet(userId);

    const balance = Number(wallet.balance);
    if (balance < dto.amount) {
      throw new BadRequestException(
        `So du khong du. Hien tai: ${balance.toLocaleString()} VND, can: ${dto.amount.toLocaleString()} VND`,
      );
    }

    const dailyUsed = Number(wallet.daily_payment_used);
    const dailyLimit = Number(wallet.daily_payment_limit);
    if (dailyUsed + dto.amount > dailyLimit) {
      throw new BadRequestException(
        `Vuot han muc thanh toan trong ngay. Con lai: ${dailyLimit - dailyUsed} VND`,
      );
    }

    const balanceBefore = balance;
    const balanceAfter = balance - dto.amount;
    const txRef = this.generateTransactionRef('PAY');

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          transactionRef: txRef,
          walletId: wallet.id,
          user_id: userId,
          type: 'PAYMENT',
          status: 'COMPLETED',
          amount: dto.amount,
          fee: 0,
          net_amount: dto.amount,
          currency: 'VND',
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          payment_method: 'WALLET',
          service_type: dto.serviceType,
          service_id: dto.serviceId || null,
          description: dto.description || `Thanh toan ${dto.amount.toLocaleString()} VND`,
          completed_at: new Date(),
        },
      }),
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          daily_payment_used: { increment: dto.amount },
          total_payment: { increment: dto.amount },
        },
      }),
    ]);

    return {
      transaction: this.formatTransaction(transaction),
      wallet: { balance: balanceAfter, currency: 'VND' },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSFER (chuyen tien)
  // ═══════════════════════════════════════════════════════════════════════════

  async transfer(userId: string, dto: TransferDto) {
    if (userId === dto.recipientId) {
      throw new BadRequestException('Khong the chuyen tien cho chinh minh');
    }

    const senderWallet = await this.ensureActiveWallet(userId);
    const recipientWallet = await this.prisma.wallet.findUnique({
      where: { userId: dto.recipientId },
    });

    if (!recipientWallet) {
      throw new NotFoundException('Nguoi nhan chua co vi');
    }

    const senderBalance = Number(senderWallet.balance);
    if (senderBalance < dto.amount) {
      throw new BadRequestException(
        `So du khong du. Hien tai: ${senderBalance.toLocaleString()} VND`,
      );
    }

    const txRef = this.generateTransactionRef('TRF');

    const [senderTx] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          transactionRef: txRef,
          walletId: senderWallet.id,
          user_id: userId,
          recipient_wallet_id: recipientWallet.id,
          recipient_user_id: dto.recipientId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: dto.amount,
          fee: 0,
          net_amount: dto.amount,
          currency: 'VND',
          balance_before: senderBalance,
          balance_after: senderBalance - dto.amount,
          payment_method: 'WALLET',
          description: `Chuyen ${dto.amount.toLocaleString()} VND`,
          note: dto.note || null,
          completed_at: new Date(),
        },
      }),
      this.prisma.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: dto.amount } },
      }),
      this.prisma.wallet.update({
        where: { id: recipientWallet.id },
        data: {
          balance: { increment: dto.amount },
          total_earned: { increment: dto.amount },
        },
      }),
    ]);

    return {
      transaction: this.formatTransaction(senderTx),
      wallet: { balance: senderBalance - dto.amount, currency: 'VND' },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WITHDRAW (rut tien)
  // ═══════════════════════════════════════════════════════════════════════════

  async withdraw(userId: string, dto: WithdrawDto) {
    const wallet = await this.ensureActiveWallet(userId);

    const balance = Number(wallet.balance);
    if (balance < dto.amount) {
      throw new BadRequestException(
        `So du khong du. Hien tai: ${balance.toLocaleString()} VND`,
      );
    }

    const dailyUsed = Number(wallet.daily_withdrawal_used);
    const dailyLimit = Number(wallet.daily_withdrawal_limit);
    if (dailyUsed + dto.amount > dailyLimit) {
      throw new BadRequestException(
        `Vuot han muc rut trong ngay. Con lai: ${dailyLimit - dailyUsed} VND`,
      );
    }

    const txRef = this.generateTransactionRef('WDR');
    const balanceBefore = balance;
    const balanceAfter = balance - dto.amount;
    const note = dto.note || (dto.bankAccount ? `Rut ve TK ${dto.bankAccount}` : undefined);

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          transactionRef: txRef,
          walletId: wallet.id,
          user_id: userId,
          type: 'WITHDRAWAL',
          status: 'PROCESSING',
          amount: dto.amount,
          fee: 0,
          net_amount: dto.amount,
          currency: 'VND',
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          payment_method: 'BANK_TRANSFER',
          description: `Rut ${dto.amount.toLocaleString()} VND ve ngan hang`,
          note: note || null,
        },
      }),
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          reserved_balance: { increment: dto.amount },
          daily_withdrawal_used: { increment: dto.amount },
          total_withdrawal: { increment: dto.amount },
        },
      }),
    ]);

    return {
      transaction: this.formatTransaction(transaction),
      wallet: { balance: balanceAfter, currency: 'VND' },
      message: 'Yeu cau rut tien dang xu ly. Du kien 1-3 ngay lam viec.',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSACTION HISTORY
  // ═══════════════════════════════════════════════════════════════════════════

  async getTransactions(userId: string, query: TransactionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map((t: any) => this.formatTransaction(t)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionDetail(userId: string, transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx || tx.user_id !== userId) {
      throw new NotFoundException('Khong tim thay giao dich');
    }

    return this.formatTransaction(tx);
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async ensureActiveWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      const walletNumber = await this.generateWalletNumber();
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          walletNumber,
          balance: 0,
          status: 'ACTIVE',
          currency: 'VND',
        },
      });
    }

    if (wallet.status !== 'ACTIVE') {
      throw new BadRequestException('Vi cua ban dang bi dong bang hoac tam khoa');
    }

    await this.resetDailyLimitsIfNeeded(wallet);

    return wallet;
  }

  private async resetDailyLimitsIfNeeded(wallet: any) {
    const today = new Date().toISOString().split('T')[0];
    const resetAt = wallet.daily_reset_at?.toISOString().split('T')[0];

    if (resetAt !== today) {
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          daily_top_up_used: 0,
          daily_payment_used: 0,
          daily_withdrawal_used: 0,
          daily_reset_at: new Date(today),
        },
      });
      wallet.daily_top_up_used = BigInt(0);
      wallet.daily_payment_used = BigInt(0);
      wallet.daily_withdrawal_used = BigInt(0);
    }
  }

  private formatWallet(w: any) {
    return {
      id: w.id,
      walletNumber: w.walletNumber,
      balance: Number(w.balance),
      reservedBalance: Number(w.reserved_balance),
      pendingWithdraw: Number(w.reserved_balance),
      xuBalance: Number(w.xu_balance),
      status: w.status,
      currency: w.currency,
      totalEarningsMonth: Number(w.total_earned),
      totalEarned: Number(w.total_earned),
      commission: 0,
      bonus: 0,
      limits: {
        dailyTopUp: { limit: Number(w.daily_top_up_limit), used: Number(w.daily_top_up_used) },
        dailyPayment: { limit: Number(w.daily_payment_limit), used: Number(w.daily_payment_used) },
        dailyWithdrawal: { limit: Number(w.daily_withdrawal_limit), used: Number(w.daily_withdrawal_used) },
      },
      totals: {
        topUp: Number(w.total_top_up),
        payment: Number(w.total_payment),
        withdrawal: Number(w.total_withdrawal),
        earned: Number(w.total_earned),
      },
      createdAt: w.createdAt,
    };
  }

  private formatTransaction(t: any) {
    return {
      id: t.id,
      transactionRef: t.transactionRef,
      type: t.type,
      status: t.status,
      amount: Number(t.amount),
      fee: Number(t.fee),
      netAmount: Number(t.net_amount),
      currency: t.currency,
      balanceBefore: Number(t.balance_before),
      balanceAfter: Number(t.balance_after),
      paymentMethod: t.payment_method,
      serviceType: t.service_type,
      serviceId: t.service_id,
      description: t.description,
      note: t.note,
      createdAt: t.createdAt,
      completedAt: t.completed_at,
    };
  }
}
