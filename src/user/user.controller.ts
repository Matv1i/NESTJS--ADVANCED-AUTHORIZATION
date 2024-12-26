import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from 'src/decorators/authotizated.decorator';
import { UserRole } from 'prisma/__generated__';
import { Authorization } from 'src/decorators/auth.decorator';
import { UpdateUSerDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async updateProfile(
    @Authorized('id') userId: string,
    @Body() dto: UpdateUSerDto,
  ) {
    return this.userService.update(userId, dto);
  }
}
