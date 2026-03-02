import AsyncStorage from '@react-native-async-storage/async-storage';

type EventHandler = (...args: any[]) => void;

const WS_BASE = __DEV__
  ? 'ws://10.0.2.2:4000'
  : 'wss://api.vmd.asia';

class RealtimeService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private reconnectTimer: any = null;
  private connected = false;

  async connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const token = await AsyncStorage.getItem('@lifestyle_access_token');
    this.socket = new WebSocket(`${WS_BASE}?token=${token || ''}`);

    this.socket.onopen = () => {
      this.connected = true;
      this.emit('connected', true);
    };

    this.socket.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data as string);
        this.emit(eventName, data);
      } catch { /* ignore */ }
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.emit('connected', false);
      this.scheduleReconnect();
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
    this.socket = null;
    this.connected = false;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), 3000);
  }

  send(event: string, data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, data }));
    }
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  private emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((h) => h(...args));
  }

  joinBookingRoom(bookingId: string) {
    this.send('join:booking', { bookingId });
  }

  leaveBookingRoom(bookingId: string) {
    this.send('leave:booking', { bookingId });
  }

  sendChatMessage(bookingId: string, message: string) {
    this.send('chat:message', { bookingId, message });
  }

  onLocationUpdate(handler: (data: { bookingId: string; lat: number; lng: number; heading?: number; speed?: number }) => void) {
    return this.on('location:update', handler);
  }

  onNotification(handler: (data: any) => void) {
    return this.on('notification', handler);
  }

  onBookingUpdate(handler: (data: any) => void) {
    return this.on('booking:update', handler);
  }

  onOrderUpdate(handler: (data: any) => void) {
    return this.on('order:update', handler);
  }

  isConnected() {
    return this.connected;
  }
}

export const realtimeService = new RealtimeService();
