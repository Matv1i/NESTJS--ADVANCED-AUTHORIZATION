import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { BaseOAuthService } from './services/base-auth.service';

export const ProviderOptionsSymbol = Symbol();

export type TypeOptions = {
  baseUrl: string;
  services: BaseOAuthService[];
};

export type TypeAsyncOPtions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>;
