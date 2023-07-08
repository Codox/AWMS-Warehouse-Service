import { PriorityStatusService } from '../../priority-status.service';
import { PriorityStatusRepository } from '../../priority-status.repository';
import { Test } from '@nestjs/testing';
import { PriorityStatusDTO } from '../../dto/priority-status.dto';
import { PriorityStatus } from '../../priority-status.entity';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

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
    it('should create a new priority status', async () => {
      const priorityStatusData: PriorityStatusDTO = {
        name: 'Very very high',
        description: 'A very very high priority',
        value: 100,
      };

      const existingPriorityStatus = null;
      jest
        .spyOn(priorityStatusRepository, 'findOne')
        .mockResolvedValue(existingPriorityStatus);

      const savedPriorityStatus = new PriorityStatus(priorityStatusData);
      jest
        .spyOn(priorityStatusRepository, 'save')
        .mockResolvedValue(savedPriorityStatus);

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

    it('should throw an error if a priority status already exists with the same name or value', async () => {
      const priorityStatusData: PriorityStatusDTO = {
        name: 'Very very high',
        description: 'A very very high priority',
        value: 100,
      };

      const existingPriorityStatus = new PriorityStatus(priorityStatusData);
      jest
        .spyOn(priorityStatusRepository, 'findOne')
        .mockResolvedValue(existingPriorityStatus);

      await expect(
        priorityStatusService.createPriorityStatus(priorityStatusData),
      ).rejects.toThrowError(BadRequestException);
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
    it('should update an existing priority status', async () => {
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

      jest
        .spyOn(priorityStatusRepository, 'findOne')
        .mockResolvedValueOnce(existingPriorityStatus)
        .mockResolvedValueOnce(undefined);

      jest
        .spyOn(priorityStatusRepository, 'save')
        .mockResolvedValueOnce(expectedUpdatedPriorityStatus);

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

    it('should throw an error if a priority status does not exist', async () => {
      jest
        .spyOn(priorityStatusRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      const uuid = faker.string.uuid();

      await expect(
        priorityStatusService.updatePriorityStatus(
          uuid,
          new PriorityStatusDTO(),
        ),
      ).rejects.toThrowError(
        new BadRequestException(`Priority Status ${uuid} not found`),
      );

      expect(priorityStatusRepository.findOne).toHaveBeenCalledWith({
        where: { uuid },
      });
    });
  });
});
