import { DataSource, DataSourceOptions } from 'typeorm';

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
  };

  if (withMigrations) options['migrations'] = ['database/migrations/*.ts'];

  return options as DataSourceOptions;
}
