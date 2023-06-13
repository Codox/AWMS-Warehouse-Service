import { ValidationArguments, ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { getAlpha2Codes } from 'i18n-iso-countries';

@ValidatorConstraint({ name: 'isAlpha2CountryCode', async: true })
@Injectable()
export class IsAlpha2CountryCode {
  async validate(text: string, args: ValidationArguments) {
    const alpha2Codes = getAlpha2Codes();

    return alpha2Codes[text] !== undefined;
  }

  defaultMessage() {
    return 'Country is invalid. Country must be an ISO 3166-1 alpha-2 code';
  }
}
