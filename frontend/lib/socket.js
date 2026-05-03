/*
 Quản lý kết nối real-time: Chat, Notifications, Room updates
 */

const WS_BASE = import.meta.env.VITE_WS_URL || ((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host);

class EduFlowSocket {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.listeners = {};
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnect = 10;
    this.isManualClose = false;
  }

  /**
   * Kết nối WebSocket
   * @param {number} userId 
   */
  connect(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    this.userId = userId;
    this.isManualClose = false;

    const url = `${WS_BASE}/ws/${userId}`;
    console.log(`[WS] Connecting to ${url}...`);

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected ✅');
      this.reconnectAttempts = 0;
      this._emit('connected', { userId });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const eventType = data.type || 'message';
        this._emit(eventType, data);
        this._emit('message', data);
      } catch (err) {
        console.error('[WS] Parse error:', err);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`[WS] Disconnected (code: ${event.code})`);
      this._emit('disconnected', { code: event.code });
      if (!this.isManualClose) {
        this._scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('[WS] Error:', error);
      this._emit('error', { error });
    };
  }

  // Ngắt kết nối
  disconnect() {
    this.isManualClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.userId = null;
    console.log('[WS] Manually disconnected');
  }

  /**
   * Gửi message qua WebSocket
   * @param {object} data 
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WS] Not connected, cannot send');
    }
  }

  // Room Actions

  joinRoom(roomId) {
    this.send({ type: 'join_room', room_id: roomId });
  }

  leaveRoom(roomId) {
    this.send({ type: 'leave_room', room_id: roomId });
  }

  sendRoomMessage(roomId, message) {
    this.send({ type: 'room_message', room_id: roomId, message });
  }

  sendChannelMessage(channelId, message) {
    this.send({ type: 'channel_message', channel_id: channelId, message });
  }

  sendDirectMessage(receiverId, message) {
    this.send({ type: 'direct_message', receiver_id: receiverId, message });
  }

  // Event Listeners

  /**
   * Đăng ký listener cho event
   * @param {string} event 
   * @param {function} callback 
   * @returns {function}
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  _emit(event, data) {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach(cb => {
      try { cb(data); } catch (err) { console.error(`[WS] Listener error (${event}):`, err); }
    });
  }

  _scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnect) {
      console.log('[WS] Max reconnect attempts reached');
      return;
    }
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);
    this.reconnectTimer = setTimeout(() => {
      if (this.userId) this.connect(this.userId);
    }, delay);
  }

  get isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton
const socket = new EduFlowSocket();
export default socket;
