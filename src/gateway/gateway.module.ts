import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    CompanyModule
  ],
  controllers: [
    CompanyController
  ],
  providers: [
    // JwtStrategy,
    // APIGuard,
    // MQService,
    // MicroserviceExceptionGatewayFilter,
  ],
})
export class GatewayModule {}
