import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getAWMSPostgresConnectionSourceOptions } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(getAWMSPostgresConnectionSourceOptions() as any),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AWMSModule {}
