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
import { ProviderService } from './provider/provider.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userServise: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorService: TwoFactorAuthService,
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

    await this.emailConfirmationService.sendVerificationToken(newUser);
    return {
      message: 'You succesfully signed up. Please confirm your email',
    };
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

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user);
      throw new UnauthorizedException(
        "You didn't confirm your email. Please check you email and confirm.",
      );
    }
    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await this.twoFactorService.sendTwoFactorToken(user.email);

        return {
          message: 'Check your email.Need a verification code ',
        };
      }
      await this.twoFactorService.validateTwoFactorToken(user.email, dto.code);
      return this.saveSession(req, user);
    }

    return this.saveSession(req, user);
  }
  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);

    const profile = await providerInstance.findUserByCode(code);
    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await this.userServise.findById(account.userId)
      : null;

    if (user) {
      return this.saveSession(req, user);
    }

    user = await this.userServise.create(
      profile.email,
      '',
      profile.name,
      profile.picture,
      AuthMethod[profile.provider.toUpperCase()],
      true,
    );

    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });
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
