import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { DangerousGoods } from '../../src/dangerous-goods/dangerous-goods.entity';
import { DangerousGoodsClassification } from '../../src/dangerous-goods/dangerous-goods-classification.entity';

export class CreateDangerousGoodsClassificationTable1688163131744
  implements MigrationInterface
{
  defaultDangerousGoodsClassifications = {
    '1': [
      new DangerousGoodsClassification({
        name: 'Explosive',
        division: '1.1 - 1.6',
      }),
    ],
    '2': [
      new DangerousGoodsClassification({
        name: 'Flammable Gas',
        division: '2.1',
      }),
      new DangerousGoodsClassification({
        name: 'Non-flammable, non-toxic gas',
        division: '2.2',
      }),
      new DangerousGoodsClassification({
        name: 'Toxic gas',
        division: '2.3',
      }),
    ],
    '3': [
      new DangerousGoodsClassification({
        name: 'Flammable liquid',
        division: null,
      }),
    ],
    '4': [
      new DangerousGoodsClassification({
        name: 'Flammable solid',
        division: '4.1',
      }),
      new DangerousGoodsClassification({
        name: 'Spontaneously combustible substance',
        division: '4.2',
      }),
      new DangerousGoodsClassification({
        name: 'Substance which in contact with water emits flammable gas',
        division: '4.3',
      }),
    ],
    '5': [
      new DangerousGoodsClassification({
        name: 'Oxidising substance',
        division: '5.1',
      }),
      new DangerousGoodsClassification({
        name: 'Organic peroxide',
        division: '5.2',
      }),
    ],
    '6': [
      new DangerousGoodsClassification({
        name: 'Toxic substance',
        division: '6.1',
      }),
      new DangerousGoodsClassification({
        name: 'Infectious substance',
        division: '6.2',
      }),
    ],
    '7': [
      new DangerousGoodsClassification({
        name: 'Radioactive material',
        division: null,
      }),
    ],
    '8': [
      new DangerousGoodsClassification({
        name: 'Corrosive substance',
        division: null,
      }),
    ],
    '9': [
      new DangerousGoodsClassification({
        name: 'Miscellaneous dangerous goods',
        division: null,
      }),
    ],
  };

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'dangerous_goods_classifications',
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
            name: 'division',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'dangerous_goods_id',
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
    );

    await queryRunner.createForeignKey(
      'dangerous_goods_classifications',
      new TableForeignKey({
        columnNames: ['dangerous_goods_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dangerous_goods',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'dangerous_goods_classifications',
      new TableIndex({
        name: 'idx_dangerous_goods_classifications_dangerous_goods_id',
        columnNames: ['dangerous_goods_id'],
      }),
    );

    const dangerousGoodsRepository =
      queryRunner.manager.getRepository(DangerousGoods);

    const dangerousGoodsClassificationRepository =
      queryRunner.manager.getRepository(DangerousGoodsClassification);

    for (const [key, dangerousGoodsClassifications] of Object.entries(
      this.defaultDangerousGoodsClassifications,
    )) {
      const dangerousGoods = await dangerousGoodsRepository.findOne({
        where: {
          unClass: key,
        },
      });

      if (dangerousGoods) {
        for (const dangerousGoodsClassification of dangerousGoodsClassifications) {
          dangerousGoodsClassification.dangerousGoods = dangerousGoods;

          await dangerousGoodsClassificationRepository.save(
            dangerousGoodsClassification,
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('dangerous_goods_classifications');
  }
}
