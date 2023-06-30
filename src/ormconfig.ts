import { DataSource, DataSourceOptions } from 'typeorm';
import { PriorityStatus } from './priority-status/priority-status.entity';
import { Company } from './company/company.entity';
import { Warehouse } from './warehouse/warehouse.entity';
import { Audit } from './audit/audit.entity';
import { OrderStatus } from './order-status/order-status.entity';
import { ProductStatus } from './product-status/product-status.entity';

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
      Audit,
      PriorityStatus,
      OrderStatus,
      ProductStatus,
    ],
  };

  if (withMigrations) options['migrations'] = ['database/migrations/*.ts'];

  return options as DataSourceOptions;
}
