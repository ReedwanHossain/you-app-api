import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatService } from './chat.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { WebSocketGateway1 } from '../websocket/websocket.gateway';
import { Message } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

const mockMessageModel = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const mockRabbitMQService = () => ({
  publish: jest.fn(),
  consume: jest.fn(),
});

const mockWebSocketGateway = () => ({
  notifyUser: jest.fn(),
});

describe('ChatService', () => {
  let service: ChatService;
  let model: Model<Message>;
  let rabbitMQService: RabbitMQService;
  let webSocketGateway: WebSocketGateway1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken(Message.name), useValue: mockMessageModel() },
        { provide: RabbitMQService, useValue: mockRabbitMQService() },
        { provide: WebSocketGateway1, useValue: mockWebSocketGateway() },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    model = module.get<Model<Message>>(getModelToken(Message.name));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
    webSocketGateway = module.get<WebSocketGateway1>(WebSocketGateway1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMessages', () => {
    it('should return messages between two users', async () => {
      const userId = 'user1';
      const contactId = 'user2';
      const messages = [
        { sender: userId, receiver: contactId, content: 'Hello!' },
        { sender: contactId, receiver: userId, content: 'Hi!' },
      ];

      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(messages),
      } as any);

      const result = await service.getMessages(userId, contactId);
      expect(result).toEqual(messages);
      expect(model.find).toHaveBeenCalledWith({
        $or: [
          { sender: userId, receiver: contactId },
          { sender: contactId, receiver: userId },
        ],
      });
    });
  });
});
