import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CompanyModule } from '../company/company.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { WarehouseController } from './controllers/warehouse.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [CompanyModule, WarehouseModule, AuditModule],
  controllers: [CompanyController, WarehouseController],
  providers: [
    // JwtStrategy,
    // APIGuard,
    // MQService,
    // MicroserviceExceptionGatewayFilter,
  ],
})
export class GatewayModule {}
