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
import { PriorityStatusRepository } from '../../../priority-status/priority-status.repository';
import { PriorityStatusCreatedEvent } from '../../../priority-status/events/priority-status-created.event';
import { PriorityStatus } from '../../../priority-status/priority-status.entity';
import { PriorityStatusUpdatedEvent } from '../../../priority-status/events/priority-status-updated.event';
import { PriorityStatusService } from '../../../priority-status/priority-status.service';

describe('AuditListener', () => {
  let auditListener: AuditListener;
  let warehouseService: WarehouseService;
  let companyService: CompanyService;
  let priorityStatusService: PriorityStatusService;
  let auditService: AuditService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuditListener,
        WarehouseService,
        CompanyService,
        PriorityStatusService,
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
          provide: PriorityStatusRepository,
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
    priorityStatusService = moduleRef.get<PriorityStatusService>(
      PriorityStatusService,
    );
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

  describe('handlePriorityStatusCreatedEvent', () => {
    it('Should create an audit entry when a priority status is created', async () => {
      const priorityStatusCreatedEvent: PriorityStatusCreatedEvent = {
        priorityStatusUuid: faker.string.uuid(),
        type: 'create',
        userUuid: faker.string.uuid(),
        createdAt: new Date(),
      };

      const priorityStatus = new PriorityStatus();
      jest
        .spyOn(priorityStatusService, 'getOne')
        .mockResolvedValue(priorityStatus);
      jest.spyOn(auditService, 'createAuditEntry').mockResolvedValue(null);

      await auditListener.handlePriorityStatusCreatedEvent(
        priorityStatusCreatedEvent,
      );

      expect(priorityStatusService.getOne).toHaveBeenCalledWith(
        priorityStatusCreatedEvent.priorityStatusUuid,
      );
      expect(auditService.createAuditEntry).toHaveBeenCalledWith({
        recordId: priorityStatus.id,
        type: PriorityStatus.name,
        action: priorityStatusCreatedEvent.type,
        oldData: null,
        newData: priorityStatus,
        userUuid: priorityStatusCreatedEvent.userUuid,
        timestamp: priorityStatusCreatedEvent.createdAt,
      });
    });
  });

  describe('handlePriorityStatusUpdatedEvent', () => {
    it('Should create an audit entry when a priority status is updated', async () => {
      const oldPriorityStatus = new PriorityStatus({
        name: 'Old - High Priority',
        description: 'Old - High Priority',
        value: 1,
      });

      const newPriorityStatus = new PriorityStatus({
        name: 'New - High Priority',
        description: 'New - High Priority',
        value: 999,
      });

      jest.spyOn(auditService, 'createAuditEntry').mockResolvedValue(null);

      const priorityStatusUpdatedEvent: PriorityStatusUpdatedEvent = {
        priorityStatusUuid: faker.string.uuid(),
        type: 'update',
        oldPriorityStatus,
        newPriorityStatus,
        userUuid: faker.string.uuid(),
        createdAt: new Date(),
      };

      await auditListener.handlePriorityStatusUpdatedEvent(
        priorityStatusUpdatedEvent,
      );

      expect(auditService.createAuditEntry).toHaveBeenCalledWith({
        recordId: newPriorityStatus.id,
        type: PriorityStatus.name,
        action: priorityStatusUpdatedEvent.type,
        oldData: oldPriorityStatus,
        newData: newPriorityStatus,
        userUuid: priorityStatusUpdatedEvent.userUuid,
        timestamp: priorityStatusUpdatedEvent.createdAt,
      });
    });
  });
});
