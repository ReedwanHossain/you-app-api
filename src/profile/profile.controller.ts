import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('')
@Controller('')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile/:id')
  async getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateProfile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.updateProfile(id, createProfileDto);
  }
}
