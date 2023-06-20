import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PriorityStatus } from '../../src/priority-status/priority-status.entity';

export class CreatePriorityStatuses1687289005795 implements MigrationInterface {
  defaultPriorityStatuses: PriorityStatus[] = [
    new PriorityStatus({
      name: 'High',
      description:
        'This priority indicates that the task or issue requires immediate attention and should be addressed as soon as possible.',
      value: 3,
    }),
    new PriorityStatus({
      name: 'Normal',
      description:
        'This priority indicates that the task or issue is of standard importance and should be addressed within a reasonable timeframe.',
      value: 2,
    }),
    new PriorityStatus({
      name: 'Low',
      description:
        'This priority indicates that the task or issue has lower importance and can be addressed at a later time, if resources allow.',
      value: 1,
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'priority_statuses',
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
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'value',
            type: 'int',
            isNullable: false,
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

    const priorityStatusRepository =
      queryRunner.manager.getRepository(PriorityStatus);
    for (const priorityStatus of this.defaultPriorityStatuses) {
      await priorityStatusRepository.save(priorityStatus);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('priority_statuses');
  }
}
