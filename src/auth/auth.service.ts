import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthMethod, User } from '../../prisma/__generated__';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { error } from 'console';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userServise: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userServise.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException(
        'Registration failed. A user with this email already exists. Please use another email or log in.',
      );
    }

    const newUser = await this.userServise.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );
    return this.saveSession(req, newUser);
  }
  public async login(req: Request, dto: LoginDto) {
    const user = await this.userServise.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException('User wasnt found');
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Invalid password or email. Try again or create a new profile.',
      );
    }

    return this.saveSession(req, user);
  }
  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              'Something went wrong. Cant end the session',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              "Something went wrong. Can't save this session ",
            ),
          );
        }
        resolve({
          user,
        });
      });
    });
  }
}
