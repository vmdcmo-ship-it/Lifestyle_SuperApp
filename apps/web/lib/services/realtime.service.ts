'use client';

import { API_CONFIG } from '../config/api';

type EventHandler = (...args: any[]) => void;

class RealtimeService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private reconnectTimer: any = null;
  private connected = false;

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || API_CONFIG.baseURL.replace('http', 'ws');
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    this.socket = new WebSocket(`${wsUrl}?token=${token || ''}`);

    this.socket.onopen = () => {
      this.connected = true;
      this.emit('connected', true);
    };

    this.socket.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data);
        this.emit(eventName, data);
      } catch { /* ignore parse errors */ }
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

  updateDriverLocation(bookingId: string, lat: number, lng: number, heading?: number, speed?: number) {
    this.send('driver:location', { bookingId, lat, lng, heading, speed });
  }

  isConnected() {
    return this.connected;
  }
}

export const realtimeService = new RealtimeService();
