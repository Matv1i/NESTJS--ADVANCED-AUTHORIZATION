import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from '../mail/mail.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
