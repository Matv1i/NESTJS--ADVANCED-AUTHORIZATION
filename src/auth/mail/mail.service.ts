import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from './templates/confirmation';
import { Resend } from 'resend';
import { ResetPasswordTemplateTemplate } from './templates/reset-password';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth';

@Injectable()
export class MailService {
  public constructor(
    private readonly configServise: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configServise.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));
    return this.sendMail(email, 'Email Confirmation', html);
  }

  public async sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      from: this.configServise.getOrThrow<string>('SENDER_EMAIL'),
      to: email,
      subject,
      html,
    });
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configServise.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplateTemplate({ domain, token }));

    return this.sendMail(email, 'Password Reset', html);
  }
  public async sendTwoFactorEmail(email: string, token: string) {
    const domain = this.configServise.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(TwoFactorAuthTemplate({ token }));

    return this.sendMail(email, 'Two Factor Auth', html);
  }
}
