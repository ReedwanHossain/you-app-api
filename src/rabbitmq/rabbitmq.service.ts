import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import {
  connect,
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private readonly logger = new Logger(RabbitMQService.name);

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      this.connection = connect([process.env.RABBITMQ_URI]);
      this.channel = this.connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
          await channel.assertExchange('chat', 'direct', { durable: true });
          await channel.assertQueue('chat_queue', { durable: true });
          await channel.bindQueue('chat_queue', 'chat', 'message');
        },
      });

      this.connection.on('connect', () =>
        this.logger.log('Connected to RabbitMQ'),
      );
      this.connection.on('disconnect', (params) =>
        this.logger.error('Disconnected from RabbitMQ', params.err),
      );
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
    }
  }

  private async disconnect() {
    try {
      await this.channel.close();
      await this.connection.close();
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to disconnect from RabbitMQ', error);
    }
  }

  async publish(exchange: string, routingKey: string, message: any) {
    try {
      await this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );
      this.logger.log(
        `Message published to exchange ${exchange} with routing key ${routingKey}`,
      );
    } catch (error) {
      this.logger.error('Failed to publish message', error);
    }
  }

  async consume(queue: string, callback: (message: any) => void) {
    try {
      await this.channel.addSetup(async (channel: ConfirmChannel) => {
        await channel.consume(queue, (msg: ConsumeMessage | null) => {
          if (msg !== null) {
            callback(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          }
        });
      });
      this.logger.log(`Consuming messages from queue ${queue}`);
    } catch (error) {
      this.logger.error('Failed to consume messages', error);
    }
  }
}
