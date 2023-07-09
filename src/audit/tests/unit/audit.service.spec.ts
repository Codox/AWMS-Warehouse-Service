import { Test } from '@nestjs/testing';
import { AuditService } from '../../audit.service';
import { AuditRepository } from '../../audit.repository';
import { Audit } from '../../audit.entity';
import { faker } from '@faker-js/faker';
import { mockSave } from '../../../shared/test/unit-test-utilities';

describe('AuditService', () => {
  let auditService: AuditService;
  let auditRepository: AuditRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: AuditRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    auditService = moduleRef.get<AuditService>(AuditService);
    auditRepository = moduleRef.get<AuditRepository>(AuditRepository);
  });

  describe('createAuditEntry', () => {
    it('Should create an audit entry', async () => {
      const auditData: Partial<Audit> = {
        type: 'Type',
        action: 'Action',
        oldData: null,
        newData: { name: faker.person.fullName() },
        userUuid: faker.string.uuid(),
        timestamp: new Date(),
      };

      const createdAudit = new Audit(auditData);
      mockSave(auditRepository, createdAudit);

      const result = await auditService.createAuditEntry(auditData);

      expect(auditRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(auditData),
      );
      expect(result).toEqual(createdAudit);
    });
  });
});
