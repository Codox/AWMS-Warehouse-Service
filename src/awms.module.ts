import { Module } from '@nestjs/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { GatewayModule } from './gateway/gateway.module';
import { DatabaseExceptionFilter } from './shared/filters/database-exception.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DangerousGoodsModule } from './dangerous-goods/dangerous-goods.module';
import { CompanyModule } from './company/company.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { AuditModule } from './audit/audit.module';
import { CountryModule } from './country/country.module';
import { PriorityStatusModule } from './priority-status/priority-status.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { ProductStatusModule } from './product-status/product-status.module';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
      tokenValidation: TokenValidation.OFFLINE,
    }),
    GatewayModule,
    EventEmitterModule.forRoot(),
    DangerousGoodsModule,
    CompanyModule,
    WarehouseModule,
    AuditModule,
    CountryModule,
    PriorityStatusModule,
    OrderStatusModule,
    ProductStatusModule,
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
