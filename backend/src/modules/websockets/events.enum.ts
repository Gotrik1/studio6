export enum SocketEvents {
  // Client to Server
  CLIENT_SEND_MESSAGE = "sendMessage",

  // Server to Client
  SERVER_BROADCAST_MESSAGE = "receiveMessage",
  SERVER_PUSH_NOTIFICATION = "newNotification",
  SERVER_UPDATE_ONLINE_STATUS = "onlineStatusUpdate",
}
