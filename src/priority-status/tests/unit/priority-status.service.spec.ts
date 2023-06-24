import { PriorityStatusService } from '../../priority-status.service';
import { PriorityStatusRepository } from '../../priority-status.repository';
import { Test } from '@nestjs/testing';
import { PriorityStatusDTO } from '../../dto/priority-status.dto';
import { PriorityStatus } from '../../priority-status.entity';
import { BadRequestException } from '@nestjs/common';

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
});
