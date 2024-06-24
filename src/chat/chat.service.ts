import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { Message } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { WebSocketGateway1 } from '../websocket/websocket.gateway';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private rabbitMQService: RabbitMQService,
    @Inject(forwardRef(() => WebSocketGateway1))
    private webSocketGateway: WebSocketGateway1,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.consume('chat_queue', async (msg) => {
      await this.handleMessage(msg);
      this.webSocketGateway.notifyUser(msg.receiver, msg);
    });
  }

  async sendMessage(createMessageDto: CreateMessageDto) {
    const message = new this.messageModel(createMessageDto);
    await message.save();
    await this.rabbitMQService.publish('chat', 'message', createMessageDto);
  }

  async getMessages(userId: string, contactId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: contactId },
          { sender: contactId, receiver: userId },
        ],
      })
      .exec();

    return messages;
  }

  async handleMessage(createMessageDto: CreateMessageDto) {
    const message = new this.messageModel(createMessageDto);
    await message.save();
    this.webSocketGateway.notifyUser(
      createMessageDto.receiver,
      createMessageDto,
    );
  }
}
