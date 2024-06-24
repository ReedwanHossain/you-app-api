import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway1 {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatService.handleMessage(message);
    this.server.emit('message', message);
  }

  notifyUser(userId: string, message: any) {
    this.server.to(userId).emit('message', message);
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}
