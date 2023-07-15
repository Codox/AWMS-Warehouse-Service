import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';
import { WarehouseService } from '../../warehouse.service';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ValidationPipe } from '@nestjs/common';
import { WarehouseModule } from '../../warehouse.module';
import { createWarehouseDTO } from '../../../shared/test/unit-test-utilities';
import { expectEndpointCalledSuccessfully } from '../../../shared/test/e2e-test-utilities';

describe('WarehouseController', () => {
  let app: NestFastifyApplication;
  let service: WarehouseService;
  let e2eTestingService: E2ETestingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [WarehouseModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe());

    service = moduleRef.get<WarehouseService>(WarehouseService);
    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/warehouse should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/warehouse',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /warehouse should resolve correctly - 200', async () => {
    const warehouseData = createWarehouseDTO();

    const warehouse = await service.createWarehouse(warehouseData);

    return app
      .inject({
        method: 'GET',
        url: '/warehouse',
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.length).toEqual(1);
        expect(result.json().data[0].uuid).toEqual(warehouse.uuid);
      });
  });

  it('GET /warehouse/:uuid should resolve correctly - 200', async () => {
    const warehouseData = createWarehouseDTO();

    const warehouse = await service.createWarehouse(warehouseData);

    return app
      .inject({
        method: 'GET',
        url: `/warehouse/${warehouse.uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.uuid).toEqual(warehouse.uuid);
      });
  });

  it('POST /warehouse should resolve correctly - 201', async () => {
    const warehouseData = createWarehouseDTO();

    return app
      .inject({
        method: 'POST',
        url: `/warehouse`,
        payload: warehouseData,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then(async (result) => {
        expectEndpointCalledSuccessfully(result, 201);

        const warehouse = await service.getRepository().findOne({
          where: {
            uuid: result.json().data.uuid,
          },
        });

        expect(warehouse).not.toBeNull();
      });
  });

  it('POST /warehouse should resolve correctly - 400 (Validation Error)', async () => {
    const warehouseData = createWarehouseDTO();

    delete warehouseData.name;

    return app
      .inject({
        method: 'POST',
        url: `/warehouse`,
        payload: warehouseData,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
      });
  });

  it('PUT /warehouse/:uuid should resolve correctly - 200', async () => {
    const warehouseData = createWarehouseDTO();

    const warehouse = await service.createWarehouse(warehouseData);
    warehouse.name = warehouse.name + ' Updated';

    return app
      .inject({
        method: 'PUT',
        url: `/warehouse/${warehouse.uuid}`,
        payload: warehouse,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then(async (result) => {
        expectEndpointCalledSuccessfully(result);

        expect(result.json().data.name).toEqual(warehouse.name);

        const updatedWarehouse = await service.getRepository().findOne({
          where: {
            uuid: warehouse.uuid,
          },
        });

        expect(updatedWarehouse).not.toBeNull();
        expect(updatedWarehouse.name).toEqual(warehouse.name);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
