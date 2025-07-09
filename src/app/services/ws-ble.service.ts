import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WsBleService {
  private socket: WebSocket | null = null;

  connect({
    onOpen,
    onMessage,
    onClose,
    onError,
  }: {
    onOpen?: () => void;
    onMessage: (msg: string) => void;
    onClose?: () => void;
    onError?: (err: Event) => void;
  }) {
    // this.socket = new WebSocket('ws://localhost:8444/bleWS/');
    this.socket = new WebSocket('ws://192.168.31.197:8444/bleWS/');
    // this.socket = new WebSocket('wss://cg84pjs84444-8444.inc1.devtunnels.ms/bleWS/');

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');git pull origin main --allow-unrelated-histories

      onOpen?.();
    };

    this.socket.onmessage = (event) => {
      console.log('📩 Server:', event.data);
      onMessage(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      onError?.(error);
    };

    this.socket.onclose = () => {
      console.log('🔌 WebSocket closed');
      onClose?.();
    };
  }

  send(msg: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(msg);
      console.log('📤 Sent:', msg);
    } else {
      console.warn('⚠️ WebSocket not open. Cannot send:', msg);
    }
  }

  close() {
    this.socket?.close();
  }
}
