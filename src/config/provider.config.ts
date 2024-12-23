import { ConfigService } from '@nestjs/config';
import { GoogleProvider } from 'src/auth/provider/google.provider';
import { TypeOptions } from 'src/auth/provider/provider.constants';

export const getProvidersConfig = async (
  ConfigService: ConfigService,
): Promise<TypeOptions> => ({
  baseUrl: ConfigService.getOrThrow<string>('APPLICATION_URL'),
  services: [
    new GoogleProvider({
      client_id: ConfigService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: ConfigService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile'],
    }),
  ],
});
