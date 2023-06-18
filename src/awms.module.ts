import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getAWMSPostgresConnectionSourceOptions } from './ormconfig';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(getAWMSPostgresConnectionSourceOptions() as any),
    }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/',
      realm: 'awms',
      clientId: 'awms-hyperlogic-service-api',
      secret: '2UTU2KRqYRlKdmC7pZ8TJIep3FPW5kAE',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    }),
    // GatewayModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    DatabaseExceptionFilter,
  ],
})
export class AWMSModule {}
