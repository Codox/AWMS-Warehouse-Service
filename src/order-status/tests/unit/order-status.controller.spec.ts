import { OrderStatusController } from '../../order-status.controller';
import { OrderStatusService } from '../../order-status.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusRepository } from '../../order-status.repository';
import { OrderStatus } from '../../order-status.entity';
import { faker } from '@faker-js/faker';

describe('OrderStatusController', () => {
  let controller: OrderStatusController;
  let orderStatusService: OrderStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderStatusController],
      providers: [
        OrderStatusService,
        {
          provide: OrderStatusRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderStatusController>(OrderStatusController);
    orderStatusService = module.get<OrderStatusService>(OrderStatusService);
  });

  it('GET /order-status should resolve correctly - 200', async () => {
    const defaultOrderStatuses: OrderStatus[] = [
      new OrderStatus({
        uuid: faker.string.uuid(),
        name: 'Back Order',
        description:
          'The item is currently out of stock in the warehouse. It is on hold until new stock arrives to fulfill the order.',
      }),
      new OrderStatus({
        uuid: faker.string.uuid(),
        name: 'Frozen',
        description:
          'The order has been temporarily put on hold or suspended in the warehouse. This status could be due to reasons such as payment verification, address confirmation, or a customer request for a temporary hold.',
      }),
      new OrderStatus({
        uuid: faker.string.uuid(),
        name: 'Cancelled',
        description:
          'The order has been canceled, either by the customer or the warehouse. No further action will be taken, and the items will not be shipped or processed.',
      }),
    ];

    jest
      .spyOn(orderStatusService, 'getAll')
      .mockImplementation(async () => defaultOrderStatuses);

    const result = await controller.getOrderStatuses();

    expect(result).toEqual(defaultOrderStatuses);
  });

  it('GET /order-status/:uuid should resolve correctly - 200', async () => {
    const orderStatus: OrderStatus = new OrderStatus({
      uuid: faker.string.uuid(),
      name: 'Back Order',
      description:
        'The item is currently out of stock in the warehouse. It is on hold until new stock arrives to fulfill the order.',
    });

    const baseResponse = {
      data: orderStatus,
    };

    jest
      .spyOn(orderStatusService.getRepository(), 'findOne')
      .mockImplementation(async () => orderStatus);

    const result = await controller.getOrderStatus(orderStatus.uuid);

    expect(result).toEqual(baseResponse);
    expect(orderStatusService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: orderStatus.uuid },
    });
  });

  it('GET /order-status/:uuid should resolve correctly - 404', async () => {
    const orderStatus: OrderStatus = new OrderStatus({
      uuid: faker.string.uuid(),
      name: 'Back Order',
      description:
        'The item is currently out of stock in the warehouse. It is on hold until new stock arrives to fulfill the order.',
    });

    const baseResponse = {
      data: orderStatus,
    };

    jest
      .spyOn(orderStatusService.getRepository(), 'findOne')
      .mockImplementation(async () => orderStatus);

    const result = await controller.getOrderStatus(orderStatus.uuid);

    expect(result).toEqual(baseResponse);
    expect(orderStatusService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: orderStatus.uuid },
    });
  });
});
