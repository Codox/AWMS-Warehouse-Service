import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAuditTable1686431648922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'audit',
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
            name: 'record_id',
            type: 'int',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'old_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'new_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'user_uuid',
            type: 'uuid',
          },
          {
            name: 'timestamp',
            type: 'timestamp',
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

    await queryRunner.createIndex(
      'audit',
      new TableIndex({
        name: 'idx_audit_record_id',
        columnNames: ['record_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('audit');
  }
}
