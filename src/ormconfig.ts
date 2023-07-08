import { DataSource, DataSourceOptions } from 'typeorm';
import { PriorityStatus } from './priority-status/priority-status.entity';
import { Company } from './company/company.entity';
import { Warehouse } from './warehouse/warehouse.entity';
import { Audit } from './audit/audit.entity';
import { OrderStatus } from './order-status/order-status.entity';
import { ProductStatus } from './product-status/product-status.entity';
import { DangerousGoods } from './dangerous-goods/dangerous-goods.entity';
import { DangerousGoodsClassification } from './dangerous-goods/dangerous-goods-classification.entity';
import { WarehouseLocation } from './warehouse-location/warehouse-location.entity';

export const AppDataSource = new DataSource(
  getAWMSPostgresConnectionSourceOptions(true),
);

export function getAWMSPostgresConnectionSourceOptions(
  withMigrations = false,
): DataSourceOptions {
  const options = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    migrationsTableName: 'migrations',
    synchronize: false,
    logger: 'advanced-console',
    entities: [
      Company,
      Warehouse,
      WarehouseLocation,
      Audit,
      PriorityStatus,
      OrderStatus,
      ProductStatus,
      DangerousGoods,
      DangerousGoodsClassification,
    ],
  };

  if (withMigrations) options['migrations'] = ['database/migrations/*.ts'];

  return options as DataSourceOptions;
}
