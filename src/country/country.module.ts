import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import {
  getEndpointProtectionProviders,
  getKeycloakConfiguration,
} from '../shared/endpoint-protection';

@Module({
  imports: [getKeycloakConfiguration()],
  providers: [...getEndpointProtectionProviders()],
  controllers: [CountryController],
  exports: [],
})
export class CountryModule {}
