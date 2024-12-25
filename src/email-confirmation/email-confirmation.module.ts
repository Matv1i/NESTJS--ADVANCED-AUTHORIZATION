import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailModule } from 'src/auth/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/auth/mail/mail.service';

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
