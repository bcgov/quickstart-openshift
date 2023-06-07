export type SocketStore = {
  isConnected: boolean;
  messages: any;
  reconnectError: boolean;
  heartBeatInterval: number;
  heartBeatTimer: number;
};
export type socketType = {
  $connect: () => void;
};
