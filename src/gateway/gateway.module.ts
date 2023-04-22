import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [],
  providers: [
    // JwtStrategy,
    // APIGuard,
    // MQService,
    // MicroserviceExceptionGatewayFilter,
  ],
})
export class GatewayModule {}
