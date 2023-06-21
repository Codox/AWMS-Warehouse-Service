import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { PriorityStatus } from './priority-status.entity';
import { PriorityStatusRepository } from './priority-status.repository';
import { PriorityStatusDTO } from './dto/priority-status.dto';

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
}
