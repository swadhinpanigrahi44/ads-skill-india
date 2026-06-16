import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: { id: string }) {
    const data = await this.usersService.getMe(user.id);
    return { success: true, data };
  }

  @Put('me')
  async updateMe(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateUserDto,
  ) {
    const data = await this.usersService.updateMe(user.id, dto);
    return { success: true, data };
  }

  @Post('me/avatar/upload-url')
  avatarUploadUrl(@CurrentUser() user: { id: string }) {
    return { success: true, data: this.usersService.getAvatarUploadParams(user.id) };
  }

  @Put('me/avatar')
  async setAvatar(
    @CurrentUser() user: { id: string },
    @Body('url') url: string,
  ) {
    const data = await this.usersService.setAvatar(user.id, url);
    return { success: true, data };
  }
}
