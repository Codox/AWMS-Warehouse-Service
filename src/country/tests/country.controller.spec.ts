import { CountryController } from '../country.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('CountryController', () => {
  let controller: CountryController;

  const testData = {
    name: 'Ukraine',
    nativeName: 'Україна',
    emoji: '🇺🇦',
    callingCode: '380',
    capital: 'Kyiv',
    currency: 'UAH',
    languages: ['uk'],
    alpha: {
      '2': 'UA',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [],
    }).compile();

    controller = module.get<CountryController>(CountryController);
  });

  it('GET /country should resolve correctly - 200', async () => {

  });

  it('GET /country/alpha/2/:code should resolve correctly - 200', async () => {});

  it('GET /country/:name should not resolve correctly(Not found) - 404', async () => {});
});
