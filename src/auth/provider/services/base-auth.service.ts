import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TypeBaseProviderOptions } from './types/base-provider.options.types';
import { TypeUserInfo } from './types/user-info.types';
@Injectable()
export class BaseOAuthService {
  private BASE_URL: string;

  public constructor(private readonly options: TypeBaseProviderOptions) {}

  //
  protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
    return {
      ...data,
      provider: this.options.name,
    };
  }

  public getAuthUrl() {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.client_id,
      redirect_uri: this.getRedirectUrl(),
      scope: (this.options.scopes ?? []).join(' '),
      access_type: 'offline',
      prompt: 'select_account',
    });
    return `${this.options.authorize_url}?${query}`;
  }

  public async findUserByCode(code: string): Promise<TypeUserInfo> {
    const client_id = this.options.client_id;
    const client_secret = this.options.client_secret;

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
    });

    const tokensRequest = await fetch(this.options.access_url, {
      method: 'POST',
      body: tokenQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    if (!tokensRequest.ok) {
      throw new BadRequestException(
        `Cant get a user with ${this.options.profile_url}. Check your access token and try again `,
      );
    }

    const tokens = await tokensRequest.json();
    if (!tokens.access_token) {
      throw new BadRequestException(
        `There are not tokens with ${this.options.access_url}`,
      );
    }
    const userRequest = await fetch(this.options.profile_url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userRequest.ok) {
      throw new UnauthorizedException(
        `Cant get a user with ${this.options.profile_url}. Make sure you have a right access token `,
      );
    }
    const user = await userRequest.json();
    const userData = await this.extractUserInfo(user);

    return {
      ...user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || tokens.expires_in,
      provider: this.options.name,
    };
  }

  public getRedirectUrl() {
    console.log(this.options.name);
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
  }
  set baseUrl(value: string) {
    this.BASE_URL = value;
  }

  get name() {
    return this.options.name;
  }
  get access_url() {
    return this.options.access_url;
  }
  get profile_url() {
    return this.options.profile_url;
  }
  get scopes() {
    return this.options.scopes;
  }
}
