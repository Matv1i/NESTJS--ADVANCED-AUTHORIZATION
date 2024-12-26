import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from 'prisma/__generated__';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { UpdateUSerDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}
  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User wasnt found');
    }
    return user;
  }
  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  public async update(userId: string, dto: UpdateUSerDto) {
    const user = await this.findById(userId);

    const updatedUser = this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        email: dto.email,
        displayName: dto.name,
        isTwoFactorEnabled: dto.isTwoFactorEnabled,
      },
    });

    return updatedUser;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        picture,
        method,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });
    return user;
  }
}
