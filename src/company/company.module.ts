import { Module } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from '../database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService],
})
export class CompanyModule {}
