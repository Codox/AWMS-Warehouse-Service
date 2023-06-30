import { ProductStatusController } from '../../product-status.controller';
import { ProductStatusService } from '../../product-status.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductStatusRepository } from '../../product-status.repository';
import { faker } from '@faker-js/faker';
import { ProductStatus } from '../../product-status.entity';

describe('ProductStatusController', () => {
  let controller: ProductStatusController;
  let productStatusService: ProductStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductStatusController],
      providers: [
        ProductStatusService,
        {
          provide: ProductStatusRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductStatusController>(ProductStatusController);
    productStatusService =
      module.get<ProductStatusService>(ProductStatusService);
  });

  it('GET /product-status should resolve correctly - 200', async () => {
    const defaultProductStatuses = [
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
    ];

    jest
      .spyOn(productStatusService, 'getAll')
      .mockImplementation(async () => defaultProductStatuses);

    const result = await controller.getProductStatuses();

    expect(result).toEqual(defaultProductStatuses);
  });

  it('GET /product-status/:uuid should resolve correctly - 200', async () => {
    const productStatus: ProductStatus = new ProductStatus({
      uuid: faker.string.uuid(),
      name: 'In Stock',
      description:
        'The product is currently available in the warehouse and ready for sale.',
    });

    const baseResponse = {
      data: productStatus,
    };

    jest
      .spyOn(productStatusService.getRepository(), 'findOne')
      .mockImplementation(async () => productStatus);

    const result = await controller.getProductStatus(productStatus.uuid);

    expect(result).toEqual(baseResponse);
    expect(productStatusService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: productStatus.uuid },
    });
  });

  it('GET /product-status/:uuid should not resolve correctly - 404', async () => {
    const productStatus: ProductStatus = new ProductStatus({
      uuid: faker.string.uuid(),
      name: 'Back Order',
      description:
        'The item is currently out of stock in the warehouse. It is on hold until new stock arrives to fulfill the order.',
    });

    jest
      .spyOn(productStatusService.getRepository(), 'findOne')
      .mockImplementation(async () => undefined);

    await expect(
      controller.getProductStatus(productStatus.uuid),
    ).rejects.toThrow(`Product Status ${productStatus.uuid} not found`);

    expect(productStatusService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: productStatus.uuid },
    });
  });
});
