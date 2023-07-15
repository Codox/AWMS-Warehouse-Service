import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompaniesTable1672637865320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
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
            name: 'code',
            type: 'varchar',
            length: '10',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'vat_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'eori_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'licences_admin',
            type: 'int',
            default: 2,
          },
          {
            name: 'licences_warehouse',
            type: 'int',
            default: 5,
          },
          {
            name: 'contact_telephone',
            type: 'varchar',
          },
          {
            name: 'address_lines',
            type: 'json',
          },
          {
            name: 'town',
            type: 'varchar',
          },
          {
            name: 'region',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '2',
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
    await queryRunner.dropTable('companies');
  }
}
