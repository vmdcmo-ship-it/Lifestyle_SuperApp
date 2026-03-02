import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  RateOrderDto,
  OrderListQueryDto,
} from './dto/order.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Orders (Food Delivery & Shopping)')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('admin/list')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({ summary: '[Admin] Danh sách tất cả đơn hàng' })
  async adminList(@Query() query: OrderListQueryDto) {
    return this.ordersService.adminList(query);
  }

  @Get('admin/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({ summary: '[Admin] Chi tiết đơn hàng' })
  async adminGetById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.adminGetById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng', description: 'Đặt đồ ăn hoặc mua hàng' })
  @ApiResponse({ status: 201, description: 'Đơn hàng đã tạo' })
  async create(@CurrentUser() user: CurrentUserData, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Đơn hàng của tôi', description: 'Lịch sử đơn hàng + phân trang' })
  async findMyOrders(@CurrentUser() user: CurrentUserData, @Query() query: OrderListQueryDto) {
    return this.ordersService.findMyOrders(user.id, query);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: '[Merchant] Đơn hàng của cửa hàng' })
  async findMerchantOrders(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @CurrentUser() user: CurrentUserData,
    @Query() query: OrderListQueryDto,
  ) {
    return this.ordersService.findMerchantOrders(merchantId, user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết đơn hàng' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn', description: 'PENDING → CONFIRMED → PREPARING → READY → ...' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, user.id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiQuery({ name: 'reason', required: false })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Query('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(id, user.id, reason);
  }

  @Patch(':id/rate')
  @ApiOperation({ summary: 'Đánh giá đơn hàng', description: 'Đánh giá sau khi nhận hàng' })
  async rate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: RateOrderDto,
  ) {
    return this.ordersService.rateOrder(id, user.id, dto);
  }
}
