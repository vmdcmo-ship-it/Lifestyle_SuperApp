import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import {
  TopUpDto,
  PaymentDto,
  TransferDto,
  WithdrawDto,
  TransactionQueryDto,
} from './dto/wallet.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@ApiTags('Wallet & Payment')
@ApiBearerAuth('access-token')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Xem thong tin vi' })
  @ApiResponse({ status: 200, description: 'Thong tin vi va so du' })
  async getWallet(@CurrentUser() user: CurrentUserData) {
    return this.walletService.getOrCreateWallet(user.id);
  }

  @Post('top-up')
  @ApiOperation({ summary: 'Nap tien vao vi' })
  @ApiResponse({ status: 201, description: 'Nap tien thanh cong' })
  async topUp(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: TopUpDto,
  ) {
    return this.walletService.topUp(user.id, dto);
  }

  @Post('pay')
  @ApiOperation({ summary: 'Thanh toan tu vi' })
  @ApiResponse({ status: 201, description: 'Thanh toan thanh cong' })
  async pay(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: PaymentDto,
  ) {
    return this.walletService.pay(user.id, dto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Chuyen tien cho nguoi khac' })
  @ApiResponse({ status: 201, description: 'Chuyen tien thanh cong' })
  async transfer(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: TransferDto,
  ) {
    return this.walletService.transfer(user.id, dto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Rut tien ve ngan hang' })
  @ApiResponse({ status: 201, description: 'Yeu cau rut tien dang xu ly' })
  async withdraw(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: WithdrawDto,
  ) {
    return this.walletService.withdraw(user.id, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Lich su giao dich' })
  @ApiResponse({ status: 200, description: 'Danh sach giao dich' })
  async getTransactions(
    @CurrentUser() user: CurrentUserData,
    @Query() query: TransactionQueryDto,
  ) {
    return this.walletService.getTransactions(user.id, query);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Chi tiet giao dich' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Thong tin giao dich' })
  async getTransaction(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.walletService.getTransactionDetail(user.id, id);
  }
}
