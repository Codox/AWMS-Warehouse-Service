import { Test } from '@nestjs/testing';
import { WarehouseService } from '../../warehouse.service';
import { WarehouseRepository } from '../../warehouse.repository';
import { WarehouseDTO } from '../../dto/warehouse.dto';
import { Warehouse } from '../../warehouse.entity';
import {
  createWarehouseDTO,
  mockFindOne,
  mockSave,
} from '../../../shared/test/unit-test-utilities';
import { faker } from '@faker-js/faker';

describe('WarehouseService', () => {
  let warehouseService: WarehouseService;
  let warehouseRepository: WarehouseRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: WarehouseRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    warehouseService = moduleRef.get<WarehouseService>(WarehouseService);
    warehouseRepository =
      moduleRef.get<WarehouseRepository>(WarehouseRepository);
  });

  describe('createWarehouse', () => {
    it('Should create a new warehouse', async () => {
      const warehouseData: WarehouseDTO = createWarehouseDTO();

      const savedWarehouse = new Warehouse(warehouseData);
      mockSave(warehouseRepository, savedWarehouse);

      const result = await warehouseService.createWarehouse(warehouseData);

      expect(warehouseRepository.save).toHaveBeenCalledWith(
        expect.any(Warehouse),
      );
      expect(result).toEqual(savedWarehouse);
    });
  });

  describe('updateWarehouse', () => {
    it('Should update a warehouse', async () => {
      const existingWarehouse = new Warehouse(createWarehouseDTO());

      const warehouseDataForUpdate: WarehouseDTO = createWarehouseDTO();
      warehouseDataForUpdate.name = 'Updated Name';

      mockFindOne(warehouseRepository, existingWarehouse);

      const updatedWarehouse = new Warehouse(warehouseDataForUpdate);
      mockSave(warehouseRepository, updatedWarehouse);

      const result = await warehouseService.updateWarehouse(
        existingWarehouse.uuid,
        warehouseDataForUpdate,
      );

      expect(warehouseRepository.save).toHaveBeenCalledWith(
        expect.any(Warehouse),
      );
      expect(result).toEqual(updatedWarehouse);
    });

    it('Should throw an error if warehouse does not exist', async () => {
      const warehouseDataForUpdate: WarehouseDTO = createWarehouseDTO();
      warehouseDataForUpdate.name = 'Updated Name';

      const uuid = faker.string.uuid();

      mockFindOne(warehouseRepository, null);

      await expect(
        warehouseService.updateWarehouse(uuid, warehouseDataForUpdate),
      ).rejects.toThrow(`Warehouse ${uuid} not found`);
      expect(warehouseService.getRepository().findOne).toHaveBeenCalledWith({
        where: { uuid },
      });
    });
  });
});
