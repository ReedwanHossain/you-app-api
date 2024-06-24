import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { WebSocketGateway1 } from '../websocket/websocket.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from './chat.service';

@Injectable()
export class ChatListener implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    @Inject(forwardRef(() => WebSocketGateway1))
    private readonly webSocketGateway: WebSocketGateway1,
    private readonly chatService: ChatService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.consume(
      'chat_queue',
      this.handleMessage.bind(this),
    );
  }

  private async handleMessage(msg: any) {
    const createMessageDto: CreateMessageDto = msg;
    await this.chatService.handleMessage(createMessageDto);

    this.webSocketGateway.notifyUser(
      createMessageDto.receiver,
      createMessageDto,
    );
  }
}
