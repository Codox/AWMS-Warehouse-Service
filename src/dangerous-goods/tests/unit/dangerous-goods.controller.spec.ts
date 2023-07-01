import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { DangerousGoodsController } from '../../dangerous-goods.controller';
import { DangerousGoodsService } from '../../dangerous-goods.service';
import { DangerousGoodsClassificationService } from '../../dangerous-goods-classification.service';
import { DangerousGoodsRepository } from '../../dangerous-goods.repository';
import { DangerousGoodsClassificationRepository } from '../../dangerous-goods-classification.repository';
import { DangerousGoods } from '../../dangerous-goods.entity';
import { DangerousGoodsClassification } from '../../dangerous-goods-classification.entity';

describe('DangerousGoodsController', () => {
  let controller: DangerousGoodsController;
  let dangerousGoodsService: DangerousGoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DangerousGoodsController],
      providers: [
        DangerousGoodsService,
        DangerousGoodsClassificationService,
        {
          provide: DangerousGoodsRepository,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: DangerousGoodsClassificationRepository,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<DangerousGoodsController>(DangerousGoodsController);
    dangerousGoodsService = module.get<DangerousGoodsService>(
      DangerousGoodsService,
    );
  });

  it('GET /dangerous-goods should resolve correctly - 200', async () => {
    const defaultDangerousGoods = [
      new DangerousGoods({
        name: 'Explosives',
        unClass: '1',
        classifications: [
          new DangerousGoodsClassification({
            name: 'Explosive',
            division: '1.1 - 1.6',
          }),
        ],
      }),
      new DangerousGoods({
        name: 'Gases',
        unClass: '2',
        classifications: [
          new DangerousGoodsClassification({
            name: 'Flammable Gas',
            division: '2.1',
          }),
          new DangerousGoodsClassification({
            name: 'Non-flammable, non-toxic gas',
            division: '2.2',
          }),
          new DangerousGoodsClassification({
            name: 'Toxic gas',
            division: '2.3',
          }),
        ],
      }),
      new DangerousGoods({
        name: 'Flammable liquid',
        unClass: '3',
        classifications: [
          new DangerousGoodsClassification({
            name: 'Flammable liquid',
            division: null,
          }),
        ],
      }),
    ];

    jest
      .spyOn(dangerousGoodsService.getRepository(), 'find')
      .mockImplementation(async () => defaultDangerousGoods);

    const result = await controller.getDangerousGoodsList();

    const baseResponse = {
      data: defaultDangerousGoods,
    };

    expect(result).toEqual(baseResponse);
  });

  it('GET /dangerous-goods/:uuid should resolve correctly - 200', async () => {
    const dangerousGoods: DangerousGoods = new DangerousGoods({
      uuid: faker.string.uuid(),
      name: 'Gases',
      unClass: '2',
      classifications: [
        new DangerousGoodsClassification({
          name: 'Flammable Gas',
          division: '2.1',
        }),
        new DangerousGoodsClassification({
          name: 'Non-flammable, non-toxic gas',
          division: '2.2',
        }),
        new DangerousGoodsClassification({
          name: 'Toxic gas',
          division: '2.3',
        }),
      ],
    });

    const baseResponse = {
      data: dangerousGoods,
    };

    jest
      .spyOn(dangerousGoodsService.getRepository(), 'findOne')
      .mockImplementation(async () => dangerousGoods);

    const result = await controller.getDangerousGoods(dangerousGoods.uuid);
    expect(result).toEqual(baseResponse);
    expect(dangerousGoodsService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: dangerousGoods.uuid },
      relations: ['classifications'],
    });
  });

  it('GET /dangerous-goods/:uuid should resolve correctly - 404', async () => {
    const dangerousGoods: DangerousGoods = new DangerousGoods({
      uuid: faker.string.uuid(),
      name: 'Gases',
      unClass: '2',
      classifications: [
        new DangerousGoodsClassification({
          name: 'Flammable Gas',
          division: '2.1',
        }),
        new DangerousGoodsClassification({
          name: 'Non-flammable, non-toxic gas',
          division: '2.2',
        }),
        new DangerousGoodsClassification({
          name: 'Toxic gas',
          division: '2.3',
        }),
      ],
    });

    jest
      .spyOn(dangerousGoodsService.getRepository(), 'findOne')
      .mockImplementation(async () => undefined);

    await expect(
      controller.getDangerousGoods(dangerousGoods.uuid),
    ).rejects.toThrow(`Dangerous Goods ${dangerousGoods.uuid} not found`);
    expect(dangerousGoodsService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: dangerousGoods.uuid },
      relations: ['classifications'],
    });
  });
});
