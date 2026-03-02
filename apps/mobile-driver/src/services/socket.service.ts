/**
 * Socket.IO client cho đơn real-time.
 * Kết nối namespace /ws, type=driver; nhận event order:new khi có đơn mới từ chợ đơn.
 */
import { io, Socket } from 'socket.io-client';
import { WS_BASE } from './api';

type OrderNewPayload = {
  id: string;
  pickup?: { lat: number; lng: number; address?: string };
  dropoff?: { lat: number; lng: number; address?: string };
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  pickupAddress?: string;
  dropoffAddress?: string;
  estimatedPrice?: number;
  totalPrice?: number;
  price?: { totalPrice?: number; distanceKm?: number };
  distanceKm?: number;
  codAmount?: number;
  senderNotes?: string;
  eta?: string;
  customerName?: string;
  customerRating?: number;
  [key: string]: unknown;
};

export type OrderNewCallback = (order: OrderNewPayload) => void;

let socket: Socket | null = null;

/** Kết nối WebSocket với userId, type=driver. Chỉ gọi khi user đã đăng nhập và isOnline. */
export function connectDriverSocket(userId: string, onOrderNew: OrderNewCallback): Socket {
  disconnectDriverSocket();

  const url = `${WS_BASE}/ws`;
  socket = io(url, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    query: { userId, type: 'driver' },
  });

  socket.on('connect', () => {
    console.log('[Socket] Driver connected to', url);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('order:new', (data: OrderNewPayload) => {
    onOrderNew(data);
  });

  return socket;
}

/** Ngắt kết nối WebSocket. */
export function disconnectDriverSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log('[Socket] Driver disconnected');
  }
}

/** Kiểm tra đã kết nối chưa. */
export function isDriverSocketConnected(): boolean {
  return socket?.connected ?? false;
}
