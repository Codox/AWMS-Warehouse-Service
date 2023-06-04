import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateWarehousesTable1685883218753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'warehouses',
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
            name: 'company_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'contact_telephone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address_line',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'town',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'region',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: false,
            length: '2',
          },
          {
            name: 'latitude',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'float',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'warehouses',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'warehouses',
      new TableIndex({
        name: 'idx_warehouses_company_id',
        columnNames: ['company_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('warehouses');
  }
}
