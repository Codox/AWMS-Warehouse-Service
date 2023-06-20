import { DataSource, DataSourceOptions } from 'typeorm';
import { PriorityStatus } from "./priority-status/priority-status.entity";

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
    entities: [PriorityStatus],
  };

  if (withMigrations) options['migrations'] = ['database/migrations/*.ts'];

  return options as DataSourceOptions;
}
