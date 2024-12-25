import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { from } from 'rxjs';
import { GoogleProvider } from 'src/auth/provider/google.provider';
import { TypeOptions } from 'src/auth/provider/provider.constants';

export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: '8275d3002@smtp-brevo.com',
      pass: 'hFJYNCsLcyEVTwPj',
    },
  },
});
