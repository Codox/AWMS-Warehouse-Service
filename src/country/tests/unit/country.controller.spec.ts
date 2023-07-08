import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from '../../country.controller';
import {
  expectExceptionToBeThrown,
  expectResponseToBeCorrect,
} from '../../../shared/test/unit-test-utilities';
import { BadRequestException } from '@nestjs/common';

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
    const result = await controller.getCounties();
    expect(result.data).toContainEqual(testData);
  });

  it('GET /country/alpha/2/:code should resolve correctly - 200', async () => {
    const resultUpperCase = await controller.getCountryByAlpha2Code('UA');
    expectResponseToBeCorrect(resultUpperCase, testData);

    const resultNormalCase = await controller.getCountryByAlpha2Code('ua');
    expectResponseToBeCorrect(resultNormalCase, testData);
  });

  it('GET /country/alpha/2/:code should not resolve correctly (Not found) - 404', async () => {
    await expectExceptionToBeThrown(
      controller.getCountryByAlpha2Code('ZZ'),
      new BadRequestException('Country ZZ not found'),
    );
  });

  it('GET /country/:name should resolve correctly - 200', async () => {
    const resultNormalCase = await controller.getCountryByName('Ukraine');
    expectResponseToBeCorrect(resultNormalCase, testData);

    const resultUpperCase = await controller.getCountryByName('UKRAINE');
    expectResponseToBeCorrect(resultUpperCase, testData);
  });

  it('GET /country/:name should not resolve correctly (Not found) - 404', async () => {
    await expectExceptionToBeThrown(
      controller.getCountryByName('Rexchoppers Kingdom'),
      new BadRequestException('Country Rexchoppers Kingdom not found'),
    );
  });

  it('Should format country correctly', async () => {
    const rawDataKey = 'UA';

    const rawDataObject = {
      name: 'Ukraine',
      native: 'Україна',
      phone: '380',
      continent: 'EU',
      capital: 'Kyiv',
      currency: 'UAH',
      languages: ['uk'],
      emoji: '🇺🇦',
      emojiU: 'U+1F1FA U+1F1E6',
    };

    const result = controller.formatCountry(rawDataKey, rawDataObject);
    expect(result).toEqual(testData);
  });
});
