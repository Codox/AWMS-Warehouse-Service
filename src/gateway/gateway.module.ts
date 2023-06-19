import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { CompanyModule } from '../company/company.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { WarehouseController } from './controllers/warehouse.controller';
import { AuditModule } from '../audit/audit.module';
import { CountryController } from '../country/country.controller';

@Module({
  imports: [CompanyModule, WarehouseModule, AuditModule],
  controllers: [CompanyController, WarehouseController, CountryController],
  providers: [],
})
export class GatewayModule {}
