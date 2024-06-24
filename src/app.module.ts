import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';

import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ChatModule } from './chat/chat.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    ProfileModule,
    ChatModule,
    RabbitMQModule,
    WebSocketModule,
  ],
})
export class AppModule {}
