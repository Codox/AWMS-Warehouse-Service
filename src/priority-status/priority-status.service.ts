import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { PriorityStatus } from './priority-status.entity';
import { PriorityStatusRepository } from './priority-status.repository';
import { PriorityStatusDTO } from './dto/priority-status.dto';
import { Not } from 'typeorm';

@Injectable()
export class PriorityStatusService extends BaseService<PriorityStatus> {
  constructor(
    private readonly priorityStatusRepository: PriorityStatusRepository,
  ) {
    super(priorityStatusRepository);
  }

  async createPriorityStatus(data: PriorityStatusDTO): Promise<PriorityStatus> {
    const existingPriorityStatus = await this.getRepository().findOne({
      where: [{ name: data.name }, { value: data.value }],
    });

    if (existingPriorityStatus) {
      throw new BadRequestException(
        `Conflicting priority status existing with name ${data.name} or value ${data.value}`,
      );
    }

    let priorityStatus = new PriorityStatus(data);
    priorityStatus = await this.priorityStatusRepository.save(priorityStatus);

    return priorityStatus;
  }

  async updatePriorityStatus(
    uuid: string,
    data: PriorityStatusDTO,
  ): Promise<{ old: PriorityStatus; new: PriorityStatus }> {
    const existingPriorityStatus = await this.getRepository().findOne({
      where: { uuid },
    });

    if (!existingPriorityStatus) {
      throw new BadRequestException(`Priority Status ${uuid} not found`);
    }

    // Check there are no other priority status with the same name or value
    const existingPriorityStatusWithSameNameOrValue =
      await this.getRepository().findOne({
        where: [
          { name: data.name, uuid: Not(uuid) },
          { value: data.value, uuid: Not(uuid) },
        ],
      });

    if (existingPriorityStatusWithSameNameOrValue) {
      throw new BadRequestException(
        `Conflicting priority status existing with name ${data.name} or value ${data.value}`,
      );
    }

    let updatedPriorityStatus = { ...existingPriorityStatus, ...data };
    updatedPriorityStatus = await this.priorityStatusRepository.save(
      updatedPriorityStatus,
    );

    return {
      old: existingPriorityStatus,
      new: updatedPriorityStatus,
    };
  }
}
