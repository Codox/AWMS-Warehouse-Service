import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { OrderStatus } from '../../src/order-status/order-status.entity';

export class CreateOrderStatuses1677338134000 implements MigrationInterface {
  defaultOrderStatuses: OrderStatus[] = [
    new OrderStatus({
      name: 'Back Order',
      description:
        'The item is currently out of stock in the warehouse. It is on hold until new stock arrives to fulfill the order.',
    }),
    new OrderStatus({
      name: 'Frozen',
      description:
        'The order has been temporarily put on hold or suspended in the warehouse. This status could be due to reasons such as payment verification, address confirmation, or a customer request for a temporary hold.',
    }),
    new OrderStatus({
      name: 'Cancelled',
      description:
        'The order has been canceled, either by the customer or the warehouse. No further action will be taken, and the items will not be shipped or processed.',
    }),
    new OrderStatus({
      name: 'Ready to pick',
      description:
        'The order has been received and is prepared for the picking process. Warehouse staff will locate and collect the items from the inventory to fulfill the order.',
    }),
    new OrderStatus({
      name: 'Picking in progress',
      description:
        'Warehouse staff is currently gathering the items from the inventory for the order. They are locating and collecting the specific items required.',
    }),
    new OrderStatus({
      name: 'Picked',
      description:
        'All the items in the order have been successfully located, collected, and are ready for further processing.',
    }),
    new OrderStatus({
      name: 'Ready to pack',
      description:
        'The order has been assembled and is awaiting packaging in the warehouse. It has been checked for accuracy, and everything is prepared to be securely packaged for shipment.',
    }),
    new OrderStatus({
      name: 'Packing in progress',
      description:
        'Warehouse staff is currently packing the items in the order. They are carefully packaging the items to ensure safe and secure delivery.',
    }),
    new OrderStatus({
      name: 'Packed',
      description:
        'The packing process for the order has been completed. All the items have been securely packaged and are ready for shipment.',
    }),
    new OrderStatus({
      name: 'Ready to ship',
      description:
        'The order has been packed and is prepared for shipment. It is awaiting pickup by the shipping carrier or scheduled for delivery to the shipping facility.',
    }),
    new OrderStatus({
      name: 'Shipped',
      description:
        'The order has been handed over to the shipping carrier and is in transit. It is on its way to the designated delivery address.',
    }),
    new OrderStatus({
      name: 'Delivered',
      description:
        'The order has been successfully delivered to the customer at the designated delivery address.',
    }),
    new OrderStatus({
      name: 'Fully Returned',
      description:
        'The customer has returned all the items from their original order to the warehouse. The warehouse has confirmed and processed the return. Inventory will be updated accordingly, and a refund or store credit may be issued.',
    }),
    new OrderStatus({
      name: 'Partially Returned',
      description:
        'Some items from the original order have been returned by the customer, while others are still in their possession or have not been processed for return yet. The warehouse has acknowledged and processed the returned items accordingly.',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'order_statuses',
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

    const orderStatusRepository =
      queryRunner.manager.getRepository(OrderStatus);
    for (const orderStatus of this.defaultOrderStatuses) {
      await orderStatusRepository.save(orderStatus);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('order_statuses');
  }
}
