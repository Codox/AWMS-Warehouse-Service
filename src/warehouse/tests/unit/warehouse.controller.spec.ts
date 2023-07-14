import { WarehouseService } from '../../warehouse.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseRepository } from '../../warehouse.repository';
import { Warehouse } from '../../warehouse.entity';
import { faker } from '@faker-js/faker';
import { FilterableData } from '../../../shared/filterable-data';
import { KeycloakUser } from '../../../user/keycloak-user';
import { WarehouseController } from '../../warehouse.controller';
import {
  createKeycloakUser,
  createWarehouse,
  createWarehouseDTO,
  expectEventEmitted,
  expectResponseToBeCorrect,
  mockFindOne,
} from '../../../shared/test/unit-test-utilities';

describe('WarehouseController', () => {
  let controller: WarehouseController;
  let warehouseService: WarehouseService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseController],
      providers: [
        WarehouseService,
        {
          provide: WarehouseRepository,
          useValue: {
            queryWithFilterable: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WarehouseController>(WarehouseController);
    warehouseService = module.get<WarehouseService>(WarehouseService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('GET /warehouse should resolve correctly - 200', async () => {
    const mockWarehouses: Warehouse[] = [
      new Warehouse({
        uuid: faker.string.uuid(),
        name: faker.company.name(),
        contactTelephone: faker.phone.number('+44##########'),

        addressLines: [faker.location.streetAddress({ useFullAddress: true })],
        town: faker.location.city(),
        region: faker.location.state(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
        country: faker.location.countryCode(),
      }),
    ];

    const baseResponse = {
      data: mockWarehouses,
      count: mockWarehouses.length,
      page: 5,
      limit: 10,
    };

    jest
      .spyOn(warehouseService.getRepository(), 'queryWithFilterable')
      .mockImplementation(async () => baseResponse);

    const filterableData: FilterableData = {
      fields: [],
      page: 5,
      limit: 10,
    };

    const result = await controller.getWarehouses(filterableData);

    expect(result).toEqual(baseResponse);
    expect(
      warehouseService.getRepository().queryWithFilterable,
    ).toHaveBeenCalledWith(filterableData);
  });

  it('GET /warehouse/:uuid should resolve correctly - 200', async () => {
    const warehouse = new Warehouse({
      uuid: faker.string.uuid(),
      name: faker.company.name(),
      contactTelephone: faker.phone.number('+44##########'),

      addressLines: [faker.location.streetAddress({ useFullAddress: true })],
      town: faker.location.city(),
      region: faker.location.state(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      country: faker.location.countryCode(),
    });

    const baseResponse = {
      data: warehouse,
    };

    jest
      .spyOn(warehouseService.getRepository(), 'findOne')
      .mockImplementation(async () => warehouse);

    const result = await controller.getWarehouse(warehouse.uuid);

    expect(result).toEqual(baseResponse);
    expect(warehouseService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: warehouse.uuid },
    });
  });

  it('GET /company/:uuid should not resolve (Not found) - 404', async () => {
    const uuid = faker.string.uuid();

    mockFindOne(warehouseService.getRepository(), undefined);

    await expect(controller.getWarehouse(uuid)).rejects.toThrow(
      `Warehouse ${uuid} not found`,
    );
    expect(warehouseService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid },
    });
  });

  it('POST /warehouse should resolve correctly - 201', async () => {
    const warehouse = createWarehouse();

    const user: KeycloakUser = createKeycloakUser();

    const baseResponse = {
      data: warehouse,
    };

    jest
      .spyOn(warehouseService, 'createWarehouse')
      .mockImplementation(async () => warehouse);

    const result = await controller.createWarehouse(warehouse, user);

    expect(result).toEqual(baseResponse);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'warehouse.created',
      expect.objectContaining({
        warehouseUuid: warehouse.uuid,
        userUuid: user.sub,
      }),
    );
  });

  it('PUT /warehouse/:uuid should resolve correctly - 200', async () => {
    const existingWarehouse = createWarehouse();

    const user: KeycloakUser = createKeycloakUser();

    const updateData = createWarehouseDTO();
    const updatedWarehouse = new Warehouse({
      ...existingWarehouse,
      ...updateData,
    });

    mockFindOne(warehouseService.getRepository(), existingWarehouse);

    jest
      .spyOn(warehouseService, 'updateWarehouse')
      .mockImplementation(async () => updatedWarehouse);

    expectResponseToBeCorrect(
      await controller.updateWarehouse(
        existingWarehouse.uuid,
        updateData,
        user,
      ),
      updatedWarehouse,
    );

    expectEventEmitted(eventEmitter, 'warehouse.updated', {
      warehouseUuid: existingWarehouse.uuid,
      userUuid: user.sub,
    });
  });

  it('PUT /warehouse/:uuid should not resolve (Not found) - 404', async () => {
    const uuid = faker.string.uuid();

    mockFindOne(warehouseService.getRepository(), undefined);

    await expect(
      controller.updateWarehouse(
        uuid,
        createWarehouseDTO(),
        createKeycloakUser(),
      ),
    ).rejects.toThrow(`Warehouse ${uuid} not found`);
    expect(warehouseService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid },
    });
  });
});
