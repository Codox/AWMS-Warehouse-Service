import { ProductStatusController } from '../../product-status.controller';
import { ProductStatusService } from '../../product-status.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductStatusRepository } from '../../product-status.repository';
import { faker } from '@faker-js/faker';
import { ProductStatus } from '../../product-status.entity';
import {
  expectExceptionToBeThrown,
  expectFindOneCalledWithUUID,
  expectResponseToBeCorrect,
  mockFind,
  mockFindOne,
} from '../../../shared/test/unit-test-utilities';
import { NotFoundException } from '@nestjs/common';

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
            find: jest.fn(),
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

    mockFind(productStatusService.getRepository(), defaultProductStatuses);

    const result = await controller.getProductStatuses();

    expectResponseToBeCorrect(result, defaultProductStatuses);
  });

  it('GET /product-status/:uuid should resolve correctly - 200', async () => {
    const productStatus: ProductStatus = new ProductStatus({
      uuid: faker.string.uuid(),
      name: 'In Stock',
      description:
        'The product is currently available in the warehouse and ready for sale.',
    });

    mockFindOne(productStatusService.getRepository(), productStatus);

    expectResponseToBeCorrect(
      await controller.getProductStatus(productStatus.uuid),
      productStatus,
    );

    expectFindOneCalledWithUUID(
      productStatusService.getRepository(),
      productStatus.uuid,
    );
  });

  it('GET /product-status/:uuid should not resolve correctly - 404', async () => {
    const productStatus: ProductStatus = new ProductStatus({
      uuid: faker.string.uuid(),
      name: 'Back Order',
      description:
        'The item is currently out of stock in the warehouse. It is on hold until new stock arrives to fulfill the order.',
    });

    mockFindOne(productStatusService.getRepository(), undefined);

    await expectExceptionToBeThrown(
      controller.getProductStatus(productStatus.uuid),
      new NotFoundException(`Product Status ${productStatus.uuid} not found`),
    );

    expectFindOneCalledWithUUID(
      productStatusService.getRepository(),
      productStatus.uuid,
    );
  });
});
