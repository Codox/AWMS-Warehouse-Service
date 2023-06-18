import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as countryInformation from 'countries-list';
import { orderBy } from 'lodash';

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
      return {
        name: countryData[key].name,
        nativeName: countryData[key].native,
        emoji: countryData[key].emoji,
        callingCode: countryData[key].phone,
        capital: countryData[key].capital,
        currency: countryData[key].currency,
        languages: countryData[key].languages,
        alpha: {
          '2': key,
        },
      };
    });

    return orderBy(
      formattedCountryData,
      [(country) => country.name.toLowerCase()],
      ['asc'],
    );
  }
}
