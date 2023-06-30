import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ProductStatus } from '../../src/product-status/product-status.entity';

export class CreateProductStatuses1688108238243 implements MigrationInterface {
  defaultProductStatuses = [
    new ProductStatus({
      name: 'In Stock',
      description:
        'The product is currently available in the warehouse and ready for sale.',
    }),
    new ProductStatus({
      name: 'Out of Stock',
      description:
        'The product is currently unavailable in the warehouse and cannot be fulfilled.',
    }),
    new ProductStatus({
      name: 'Backorder',
      description:
        'The product is temporarily out of stock but can be ordered and will be fulfilled when available.',
    }),
    new ProductStatus({
      name: 'Discontinued',
      description:
        'The product has been discontinued and is no longer being manufactured or sold.',
    }),
    new ProductStatus({
      name: 'On Hold',
      description:
        'The product is temporarily held or blocked for various reasons, such as quality control or pending investigation.',
    }),
    new ProductStatus({
      name: 'Quarantine',
      description:
        'The product is isolated and placed in quarantine due to quality concerns or suspected contamination.',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'product_statuses',
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
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
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

    const productStatusRepository =
      queryRunner.manager.getRepository(ProductStatus);
    for (const productStatus of this.defaultProductStatuses) {
      await productStatusRepository.save(productStatus);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('product_statuses');
  }
}
