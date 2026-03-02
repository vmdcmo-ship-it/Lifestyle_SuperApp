import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  RateOrderDto,
  OrderListQueryDto,
} from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateOrderNumber(): Promise<string> {
    const count = await this.prisma.order.count();
    return `LS-ORD-${String(count + 1).padStart(6, '0')}`;
  }

  async create(userId: string, dto: CreateOrderDto) {
    const merchant = await this.prisma.merchants.findUnique({
      where: { id: dto.merchantId },
    });
    if (!merchant || merchant.status !== 'ACTIVE') {
      throw new BadRequestException('Cửa hàng không khả dụng');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, merchantId: dto.merchantId, isActive: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = BigInt(0);
    const orderItems: any[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Sản phẩm ${item.productId} không tồn tại hoặc đã ngừng bán`);
      }
      if (product.stock > 0 && product.stock < item.quantity) {
        throw new BadRequestException(`${product.name} chỉ còn ${product.stock} sản phẩm`);
      }
      const itemTotal = product.price * BigInt(item.quantity);
      subtotal += itemTotal;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
        options: item.options || {},
        note: item.note || null,
      });
    }

    const deliveryFee = dto.type === 'PICKUP' ? BigInt(0) : BigInt(25000);
    const discount = BigInt(0);
    const totalAmount = subtotal + deliveryFee - discount;
    const orderNumber = await this.generateOrderNumber();

    const estimatedDeliveryMin =
      dto.type === 'FOOD_DELIVERY' ? 30 : dto.type === 'SHOPPING' ? 60 : null;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        merchantId: dto.merchantId,
        type: dto.type as any,
        status: 'PENDING',
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        paymentMethod: (dto.paymentMethod as any) || null,
        paymentStatus: 'UNPAID',
        deliveryAddress: dto.deliveryAddress || null,
        deliveryLat: dto.deliveryLat || null,
        deliveryLng: dto.deliveryLng || null,
        deliveryNote: dto.deliveryNote || null,
        estimatedDeliveryMin,
        note: dto.note || null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (product && product.stock > 0) {
        await this.prisma.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: item.quantity },
            totalSold: { increment: item.quantity },
          },
        });
      }
    }

    return this.formatOrder(order);
  }

  async adminList(query: OrderListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { orderNumber: { contains: term, mode: 'insensitive' } },
        { merchant: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true, merchant: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((o) => this.formatOrder(o)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async adminGetById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, merchant: { select: { id: true, name: true, phone: true, full_address: true } } },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return this.formatOrder(order);
  }

  async findMyOrders(userId: string, query: OrderListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { userId };
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((o) => this.formatOrder(o)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMerchantOrders(merchantId: string, userId: string, query: OrderListQueryDto) {
    const merchant = await this.prisma.merchants.findUnique({ where: { id: merchantId } });
    if (!merchant || merchant.owner_user_id !== userId) {
      throw new BadRequestException('Bạn không có quyền xem đơn hàng này');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { merchantId };
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((o) => this.formatOrder(o)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, merchant: { select: { name: true, phone: true, full_address: true } } },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return this.formatOrder(order);
  }

  async updateStatus(orderId: string, userId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { merchant: true },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY'],
      READY: ['PICKED_UP'],
      PICKED_UP: ['DELIVERING'],
      DELIVERING: ['DELIVERED'],
      DELIVERED: ['COMPLETED'],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Không thể chuyển từ ${order.status} sang ${dto.status}`,
      );
    }

    const data: any = { status: dto.status };
    const now = new Date();
    switch (dto.status) {
      case 'CONFIRMED': data.confirmedAt = now; break;
      case 'PREPARING': data.preparingAt = now; break;
      case 'READY': data.readyAt = now; break;
      case 'PICKED_UP': data.pickedUpAt = now; break;
      case 'DELIVERED': data.deliveredAt = now; break;
      case 'COMPLETED':
        data.paymentStatus = 'PAID';
        if (order.merchant) {
          await this.prisma.merchants.update({
            where: { id: order.merchantId },
            data: {
              total_orders: { increment: 1 },
              total_revenue: { increment: order.totalAmount },
            },
          });
        }
        break;
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data,
      include: { items: true },
    });

    return this.formatOrder(updated);
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền hủy đơn này');
    }

    const cancellable = ['PENDING', 'CONFIRMED'];
    if (!cancellable.includes(order.status)) {
      throw new BadRequestException(`Không thể hủy đơn ở trạng thái ${order.status}`);
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelReason: reason || null,
        cancelledAt: new Date(),
      },
      include: { items: true },
    });

    return this.formatOrder(updated);
  }

  async rateOrder(orderId: string, userId: string, dto: RateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId) throw new BadRequestException('Bạn không có quyền đánh giá');
    if (order.status !== 'COMPLETED' && order.status !== 'DELIVERED') {
      throw new BadRequestException('Chỉ đánh giá đơn đã hoàn thành');
    }
    if (order.rating) throw new BadRequestException('Đơn đã được đánh giá');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { rating: dto.rating, ratingComment: dto.comment || null },
      include: { items: true },
    });

    const allOrders = await this.prisma.order.findMany({
      where: { merchantId: order.merchantId, rating: { not: null } },
      select: { rating: true },
    });
    const avgRating = allOrders.reduce((s, o) => s + Number(o.rating), 0) / allOrders.length;

    await this.prisma.merchants.update({
      where: { id: order.merchantId },
      data: { rating_overall: Math.round(avgRating * 100) / 100, total_reviews: allOrders.length },
    });

    return this.formatOrder(updated);
  }

  private formatOrder(o: any) {
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      type: o.type,
      status: o.status,
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.deliveryFee),
      discount: Number(o.discount),
      totalAmount: Number(o.totalAmount),
      currency: o.currency,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      delivery: {
        address: o.deliveryAddress,
        lat: o.deliveryLat ? Number(o.deliveryLat) : null,
        lng: o.deliveryLng ? Number(o.deliveryLng) : null,
        note: o.deliveryNote,
        estimatedMin: o.estimatedDeliveryMin,
      },
      items: o.items?.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        name: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        totalPrice: Number(i.totalPrice),
        options: i.options,
        note: i.note,
      })) || [],
      rating: o.rating ? Number(o.rating) : null,
      ratingComment: o.ratingComment,
      note: o.note,
      cancelReason: o.cancelReason,
      merchant: o.merchant || undefined,
      timestamps: {
        created: o.createdAt,
        confirmed: o.confirmedAt,
        preparing: o.preparingAt,
        ready: o.readyAt,
        pickedUp: o.pickedUpAt,
        delivered: o.deliveredAt,
        cancelled: o.cancelledAt,
      },
    };
  }
}
