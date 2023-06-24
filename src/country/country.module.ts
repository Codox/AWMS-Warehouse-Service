import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';

@Module({
  providers: [],
  controllers: [CountryController],
  exports: [],
})
export class CountryModule {}
