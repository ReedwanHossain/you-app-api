import { forwardRef, Module } from '@nestjs/common';
import { WebSocketGateway1 } from './websocket.gateway';
import { ChatModule } from '../chat/chat.module';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [forwardRef(() => ChatModule)],
  providers: [WebSocketGateway1],
  exports: [WebSocketGateway1],
})
export class WebSocketModule {}
