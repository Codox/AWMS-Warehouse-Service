import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import * as countryInformation from 'countries-list';
import { orderBy, has, get, findKey, toLower } from 'lodash';

@Controller('country')
@ApiTags('country')
@UseInterceptors(ClassSerializerInterceptor)
export class CountryController {
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiTags('country')
  async getCounties() {
    const countryData = countryInformation.countries;

    const formattedCountryData = Object.keys(countryData).map((key) => {
      return this.formatCountry(key, countryData[key]);
    });

    return {
      data: orderBy(
        formattedCountryData,
        [(country) => country.name.toLowerCase()],
        ['asc'],
      ),
    };
  }

  @Get('/alpha/2/:code')
  @HttpCode(HttpStatus.OK)
  @ApiTags('country')
  @ApiParam({
    name: 'code',
    type: String,
    required: true,

    description: 'Country alpha 2 code',
  })
  async getCountryByAlpha2Code(@Param('code') code: string) {
    code = code.toUpperCase();

    const countryData = countryInformation.countries[code];

    if (!countryData) {
      throw new Error(`Country ${code} not found`);
    }

    return {
      data: this.formatCountry(code, countryData),
    };
  }

  @Get('/:name')
  @HttpCode(HttpStatus.OK)
  @ApiTags('country')
  @ApiParam({
    name: 'name',
    type: String,
    required: true,

    description: 'Country name',
  })
  async getCountryByName(@Param('name') name: string) {
    const countryData = countryInformation.countries;

    const foundKey = findKey(
      countryData,
      (value) => has(value, 'name') && toLower(value.name) === toLower(name),
    );

    const foundObject = get(countryData, foundKey, null);

    if (!foundKey) {
      throw new Error(`Country ${name} not found`);
    }

    return {
      data: this.formatCountry(foundKey, foundObject),
    };
  }

  formatCountry(key, countryData) {
    return {
      name: countryData.name,
      nativeName: countryData.native,
      emoji: countryData.emoji,
      callingCode: countryData.phone,
      capital: countryData.capital,
      currency: countryData.currency,
      languages: countryData.languages,
      alpha: {
        '2': key,
      },
    };
  }
}
