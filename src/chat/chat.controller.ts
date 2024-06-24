import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request,
  ) {
    createMessageDto.sender = req.body.sender;
    await this.chatService.sendMessage(createMessageDto);
    return { message: 'Message sent successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  async getMessages(
    @Req() req: Request,
    @Query('contactId') contactId: string,
  ) {
    const messages = await this.chatService.getMessages(
      req.body.sender,
      contactId,
    );
    return messages;
  }
}
