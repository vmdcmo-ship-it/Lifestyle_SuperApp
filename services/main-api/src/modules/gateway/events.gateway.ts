import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface LocationUpdate {
  bookingId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
}

interface ChatMessage {
  bookingId: string;
  message: string;
  senderId: string;
  senderType: 'user' | 'driver';
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
  transports: ['websocket', 'polling'],
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EventsGateway');
  private connectedClients = new Map<string, { socketId: string; userId: string; type: string }>();

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const type = (client.handshake.query.type as string) || 'user';

    if (userId) {
      this.connectedClients.set(client.id, { socketId: client.id, userId, type });
      client.join(`user:${userId}`);
      if (type === 'driver') {
        client.join('drivers');
      }
      this.logger.log(`Client connected: ${client.id} (user: ${userId}, type: ${type})`);
    }

    this.server.emit('stats', {
      connectedClients: this.connectedClients.size,
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:booking')
  handleJoinBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string },
  ) {
    client.join(`booking:${data.bookingId}`);
    return { event: 'joined', data: { room: `booking:${data.bookingId}` } };
  }

  @SubscribeMessage('leave:booking')
  handleLeaveBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string },
  ) {
    client.leave(`booking:${data.bookingId}`);
    return { event: 'left', data: { room: `booking:${data.bookingId}` } };
  }

  @SubscribeMessage('driver:location')
  handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LocationUpdate,
  ) {
    this.server.to(`booking:${data.bookingId}`).emit('location:update', {
      bookingId: data.bookingId,
      lat: data.lat,
      lng: data.lng,
      heading: data.heading,
      speed: data.speed,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('chat:message')
  handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessage,
  ) {
    this.server.to(`booking:${data.bookingId}`).emit('chat:new', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('join:order')
  handleJoinOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    client.join(`order:${data.orderId}`);
    return { event: 'joined', data: { room: `order:${data.orderId}` } };
  }

  // ─── Server-side emit methods (called from services) ───────────────────

  emitBookingUpdate(bookingId: string, data: any) {
    this.server.to(`booking:${bookingId}`).emit('booking:update', data);
  }

  emitOrderUpdate(orderId: string, data: any) {
    this.server.to(`order:${orderId}`).emit('order:update', data);
  }

  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  /** Đẩy đơn mới đến tất cả tài xế online (chợ đơn real-time). */
  emitNewOrderToDrivers(order: any) {
    this.server.to('drivers').emit('order:new', order);
  }

  getOnlineClients() {
    return {
      total: this.connectedClients.size,
      clients: Array.from(this.connectedClients.values()),
    };
  }
}
