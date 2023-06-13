import { Test } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { IsAlpha2CountryCode } from '../../validators/is-alpha-2-country-code.validator';

describe('IsAlpha2CountryCode', () => {
  let validator: IsAlpha2CountryCode;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [IsAlpha2CountryCode],
    }).compile();

    validator = moduleRef.get<IsAlpha2CountryCode>(IsAlpha2CountryCode);
  });

  describe('validate', () => {
    it('Should return true for a valid alpha-2 country code', async () => {
      const countryCode = 'US';
      const validationArgs: ValidationArguments = {
        constraints: [],
        value: countryCode,
        object: {},
        property: '',
        targetName: '',
      };

      const result = await validator.validate(countryCode, validationArgs);

      expect(result).toBe(true);
    });

    it('Should return false for an invalid alpha-2 country code', async () => {
      const countryCode = 'XYZ';
      const validationArgs: ValidationArguments = {
        constraints: [],
        value: countryCode,
        object: {},
        property: '',
        targetName: '',
      };

      const result = await validator.validate(countryCode, validationArgs);

      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('Should return the default error message', () => {
      const errorMessage = validator.defaultMessage();

      expect(errorMessage).toBe(
        'Country is invalid. Country must be an ISO 3166-1 alpha-2 code',
      );
    });
  });
});
