import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getAWMSPostgresConnectionSourceOptions } from './ormconfig';
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(getAWMSPostgresConnectionSourceOptions() as any),
    }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/',
      realm: 'awms',
      clientId: 'admin-cli',
      secret: '',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AWMSModule {}
