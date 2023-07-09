import { Test } from '@nestjs/testing';
import { WarehouseService } from '../../warehouse.service';
import { WarehouseRepository } from '../../warehouse.repository';
import { WarehouseDTO } from '../../dto/warehouse.dto';
import { Warehouse } from '../../warehouse.entity';
import {
  createWarehouseDTO,
  mockSave,
} from '../../../shared/test/unit-test-utilities';

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
});
