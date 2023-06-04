import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWarehouseLocationsTable1685883218756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'warehouse_locations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'width',
            type: 'float',
            default: 0,
          },
          {
            name: 'height',
            type: 'float',
            default: 0,
          },
          {
            name: 'depth',
            type: 'float',
            default: 0,
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('locations');
  }
}
