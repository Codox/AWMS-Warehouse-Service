import { Test } from '@nestjs/testing';
import { WarehouseService } from '../../warehouse.service';
import { WarehouseRepository } from '../../warehouse.repository';
import { WarehouseDTO } from '../../dto/warehouse.dto';
import { faker } from '@faker-js/faker';
import { Warehouse } from '../../warehouse.entity';

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
    it('should create a new warehouse', async () => {
      const warehouseData: WarehouseDTO = {
        name: faker.company.name(),
        contactTelephone: faker.phone.number('+44##########'),
        addressLines: [
          faker.location.streetAddress(),
          faker.location.secondaryAddress(),
        ],
        town: faker.location.city(),
        region: faker.location.state(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      };

      const savedWarehouse = new Warehouse(warehouseData);
      jest.spyOn(warehouseRepository, 'save').mockResolvedValue(savedWarehouse);

      const result = await warehouseService.createWarehouse(warehouseData);

      expect(warehouseRepository.save).toHaveBeenCalledWith(
        expect.any(Warehouse),
      );
      expect(result).toBe(savedWarehouse);
    });
  });
});
