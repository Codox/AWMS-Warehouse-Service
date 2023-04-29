import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';

@Module({
  imports: [],
  controllers: [],
  providers: [
    // JwtStrategy,
    // APIGuard,
    // MQService,
    // MicroserviceExceptionGatewayFilter,
  ],
})
export class GatewayModule {}
