import { PriorityStatusService } from '../../priority-status.service';
import { PriorityStatusRepository } from '../../priority-status.repository';
import { Test } from '@nestjs/testing';
import { PriorityStatusDTO } from '../../dto/priority-status.dto';
import { PriorityStatus } from '../../priority-status.entity';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import {
  expectExceptionToBeThrown,
  expectFindOneCalledWithUUID,
  mockFindOne,
  mockSave,
} from '../../../shared/test/unit-test-utilities';

describe('PriorityStatusService', () => {
  let priorityStatusService: PriorityStatusService;
  let priorityStatusRepository: PriorityStatusRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PriorityStatusService,
        {
          provide: PriorityStatusRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    priorityStatusService = moduleRef.get<PriorityStatusService>(
      PriorityStatusService,
    );
    priorityStatusRepository = moduleRef.get<PriorityStatusRepository>(
      PriorityStatusRepository,
    );
  });

  describe('createPriorityStatus', () => {
    it('Should create a new priority status', async () => {
      const priorityStatusData: PriorityStatusDTO = {
        name: 'Very very high',
        description: 'A very very high priority',
        value: 100,
      };

      const existingPriorityStatus = null;
      mockFindOne(priorityStatusRepository, existingPriorityStatus);

      const savedPriorityStatus = new PriorityStatus(priorityStatusData);
      mockSave(priorityStatusRepository, savedPriorityStatus);

      const result = await priorityStatusService.createPriorityStatus(
        priorityStatusData,
      );

      expect(priorityStatusRepository.findOne).toHaveBeenCalledWith({
        where: [
          { name: priorityStatusData.name },
          { value: priorityStatusData.value },
        ],
      });
      expect(priorityStatusRepository.save).toHaveBeenCalledWith(
        priorityStatusData,
      );
      expect(result).toEqual(savedPriorityStatus);
    });

    it('Should throw an error if a priority status already exists with the same name or value', async () => {
      const priorityStatusData: PriorityStatusDTO = {
        name: 'Very very high',
        description: 'A very very high priority',
        value: 100,
      };

      const existingPriorityStatus = new PriorityStatus(priorityStatusData);
      mockFindOne(priorityStatusRepository, existingPriorityStatus);

      await expectExceptionToBeThrown(
        priorityStatusService.createPriorityStatus(priorityStatusData),
        new BadRequestException(
          `Conflicting priority status existing with name ${priorityStatusData.name} or value ${priorityStatusData.value}`,
        ),
      );

      expect(priorityStatusRepository.findOne).toHaveBeenCalledWith({
        where: [
          { name: priorityStatusData.name },
          { value: priorityStatusData.value },
        ],
      });
      expect(priorityStatusRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updatePriorityStatus', () => {
    it('Should update an existing priority status', async () => {
      const existingPriorityStatus = new PriorityStatus({
        uuid: faker.string.uuid(),
        name: 'Critical',
        description: 'A critical priority',
        value: 999,
      });

      const priorityStatusData: PriorityStatusDTO = {
        name: 'Mid-Critical',
        description: 'Slightly under critical',
        value: 900,
      };

      const expectedUpdatedPriorityStatus = new PriorityStatus({
        uuid: existingPriorityStatus.uuid,
        name: 'Mid-Critical',
        description: 'Slightly under critical',
        value: 900,
      });

      mockFindOne(priorityStatusRepository, [
        existingPriorityStatus,
        undefined,
      ]);

      mockSave(priorityStatusRepository, expectedUpdatedPriorityStatus);

      const oldNewPriorityService =
        await priorityStatusService.updatePriorityStatus(
          existingPriorityStatus.uuid,
          priorityStatusData,
        );

      expect(oldNewPriorityService).toEqual({
        old: existingPriorityStatus,
        new: expectedUpdatedPriorityStatus,
      });
    });

    it('Should throw an error if a priority status does not exist', async () => {
      mockFindOne(priorityStatusRepository, undefined);

      const uuid = faker.string.uuid();

      await expectExceptionToBeThrown(
        priorityStatusService.updatePriorityStatus(
          uuid,
          new PriorityStatusDTO(),
        ),
        new BadRequestException(`Priority Status ${uuid} not found`),
      );
      expectFindOneCalledWithUUID(priorityStatusRepository, uuid);
    });

    it('Should throw an error if a priority status already exists with the same name or value', async () => {
      const existingPriorityStatus = new PriorityStatus({
        uuid: faker.string.uuid(),
        name: 'Critical',
        description: 'A critical priority',
        value: 999,
      });

      const priorityStatusWithSameNameOrValue: PriorityStatusDTO = {
        name: 'Mid-Critical',
        description: 'Slightly under critical',
        value: 999,
      };

      const priorityStatusDataToUpdate: PriorityStatusDTO = {
        name: 'Mid',
        value: 999,
      };

      mockFindOne(priorityStatusRepository, [
        existingPriorityStatus,
        priorityStatusWithSameNameOrValue,
      ]);

      await expectExceptionToBeThrown(
        priorityStatusService.updatePriorityStatus(
          existingPriorityStatus.uuid,
          priorityStatusDataToUpdate,
        ),
        new BadRequestException(
          `Conflicting priority status existing with name ${priorityStatusDataToUpdate.name} or value ${priorityStatusDataToUpdate.value}`,
        ),
      );
    });
  });
});
