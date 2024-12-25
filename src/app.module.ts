import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from './auth/provider/provider.module';
import { MailModule } from './auth/mail/mail.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным во всем приложении
      envFilePath: '.env', // Указывает путь к вашему файлу .env
    }),

    PrismaModule,
    AuthModule,
    UserModule,
    ProviderModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
  ],
})
export class AppModule {}
