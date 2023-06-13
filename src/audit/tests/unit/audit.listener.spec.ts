import { AuditListener } from '../../audit.listener';
import { WarehouseService } from '../../../warehouse/warehouse.service';
import { CompanyService } from '../../../company/company.service';
import { AuditService } from '../../audit.service';
import { Test } from '@nestjs/testing';
import { WarehouseCreatedEvent } from '../../../warehouse/events/warehouse-created.event';
import { faker } from '@faker-js/faker';
import { Warehouse } from '../../../warehouse/warehouse.entity';
import { CompanyCreatedEvent } from '../../../company/events/company-created.event';
import { Company } from '../../../company/company.entity';
import { CompanyRepository } from '../../../company/company.repository';
import { WarehouseRepository } from '../../../warehouse/warehouse.repository';
import { AuditRepository } from '../../audit.repository';

describe('AuditListener', () => {
  let auditListener: AuditListener;
  let warehouseService: WarehouseService;
  let companyService: CompanyService;
  let auditService: AuditService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuditListener,
        WarehouseService,
        CompanyService,
        AuditService,
        {
          provide: WarehouseRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CompanyRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AuditRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    auditListener = moduleRef.get<AuditListener>(AuditListener);
    warehouseService = moduleRef.get<WarehouseService>(WarehouseService);
    companyService = moduleRef.get<CompanyService>(CompanyService);
    auditService = moduleRef.get<AuditService>(AuditService);
  });

  describe('handleWarehouseCreatedEvent', () => {
    it('Should create an audit entry when a warehouse is created', async () => {
      const warehouseCreatedEvent: WarehouseCreatedEvent = {
        warehouseUuid: faker.string.uuid(),
        type: 'create',
        userUuid: faker.string.uuid(),
        createdAt: new Date(),
      };

      const warehouse = new Warehouse(); // Create a mock warehouse object
      jest.spyOn(warehouseService, 'getOne').mockResolvedValue(warehouse);
      jest.spyOn(auditService, 'createAuditEntry').mockResolvedValue(null);

      await auditListener.handleWarehouseCreatedEvent(warehouseCreatedEvent);

      expect(warehouseService.getOne).toHaveBeenCalledWith(
        warehouseCreatedEvent.warehouseUuid,
      );
      expect(auditService.createAuditEntry).toHaveBeenCalledWith({
        recordId: warehouse.id,
        type: Warehouse.name,
        action: warehouseCreatedEvent.type,
        oldData: null,
        newData: warehouse,
        userUuid: warehouseCreatedEvent.userUuid,
        timestamp: warehouseCreatedEvent.createdAt,
      });
    });
  });

  describe('handleCompanyCreatedEvent', () => {
    it('Should create an audit entry when a company is created', async () => {
      const companyCreatedEvent: CompanyCreatedEvent = {
        companyUuid: faker.string.uuid(),
        type: 'create',
        userUuid: faker.string.uuid(),
        createdAt: new Date(),
      };

      const company = new Company(); // Create a mock company object
      jest.spyOn(companyService, 'getOne').mockResolvedValue(company);
      jest.spyOn(auditService, 'createAuditEntry').mockResolvedValue(null);

      await auditListener.handleCompanyCreatedEvent(companyCreatedEvent);

      expect(companyService.getOne).toHaveBeenCalledWith(
        companyCreatedEvent.companyUuid,
      );
      expect(auditService.createAuditEntry).toHaveBeenCalledWith({
        recordId: company.id,
        type: Company.name,
        action: companyCreatedEvent.type,
        oldData: null,
        newData: company,
        userUuid: companyCreatedEvent.userUuid,
        timestamp: companyCreatedEvent.createdAt,
      });
    });
  });
});
