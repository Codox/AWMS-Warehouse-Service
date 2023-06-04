import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { Location } from './location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService, LocationRepository],
  exports: [],
})
export class LocationModule {}
