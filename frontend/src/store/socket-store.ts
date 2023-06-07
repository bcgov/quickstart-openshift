import { defineStore } from 'pinia';
import store from '@/store';
import main from '@/main';
import type { SocketStore } from '@/type/pinia-types';

const useSocketStore = defineStore({
  id: 'socket',
  state: (): SocketStore => ({
    isConnected: false,
    messages: [],
    reconnectError: false,
    heartBeatInterval: 50000,
    heartBeatTimer: 0,
  }),
  actions: {
    SOCKET_ONOPEN(event: any) {
      console.log('successful websocket connection');
      main.config.globalProperties.$socket = event.currentTarget;
      this.isConnected = true;
      this.heartBeatTimer = window.setInterval(() => {
        const message = 'heart beat';
        this.isConnected &&
          main.config.globalProperties.$socket.sendObj({
            code: 200,
            msg: message,
          });
      }, this.heartBeatInterval);
    },
    SOCKET_ONCLOSE(event: any) {
      this.isConnected = false;
      window.clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = 0;
      console.log(event);
    },
    SOCKET_ONERROR(event: any) {
      console.error(event);
    },
    SOCKET_ONMESSAGE(message: any) {
      console.info('message', message);
      this.messages.push(message);
    },
    SOCKET_RECONNECT(count: any) {
      console.info('count', count);
    },
    SOCKET_RECONNECT_ERROR() {
      this.reconnectError = true;
    },
  },
  getters: {
    getMessages(state) {
      return state.messages;
    },
  },
});

// Need to be used outside the setup
/**
 *
 */
export function useSocketStoreWithOut() {
  return useSocketStore(store);
}

export default useSocketStore;
