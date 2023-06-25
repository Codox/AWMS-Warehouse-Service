import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CompanyModule } from '../company/company.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { WarehouseController } from './controllers/warehouse.controller';
import { AuditModule } from '../audit/audit.module';
import { PriorityStatusModule } from '../priority-status/priority-status.module';
import { CountryModule } from '../country/country.module';
import { OrderStatusModule } from '../order-status/order-status.module';

@Module({
  imports: [
    CompanyModule,
    WarehouseModule,
    AuditModule,
    CountryModule,
    PriorityStatusModule,
    OrderStatusModule,
  ],
  controllers: [CompanyController, WarehouseController],
  providers: [],
})
export class GatewayModule {}
