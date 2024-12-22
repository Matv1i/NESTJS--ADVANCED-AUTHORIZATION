import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным во всем приложении
      envFilePath: '.env', // Указывает путь к вашему файлу .env
    }),

    PrismaModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
