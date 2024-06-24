import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message, MessageSchema } from './schemas/message.schema';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { WebSocketModule } from 'src/websocket/websocket.module';
import { ChatListener } from './chat.listener';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    RabbitMQModule,
    forwardRef(() => WebSocketModule),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatListener],
  exports: [ChatService],
})
export class ChatModule {}
