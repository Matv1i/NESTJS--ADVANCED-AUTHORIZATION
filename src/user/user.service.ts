import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from 'prisma/__generated__';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

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
