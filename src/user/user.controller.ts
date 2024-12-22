import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from 'src/decorators/authotizated.decorator';
import { UserRole } from 'prisma/__generated__';
import { Authorization } from 'src/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }
}
