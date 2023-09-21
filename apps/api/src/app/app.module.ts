import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RMQModule } from 'nestjs-rmq';
import { getJwtConfig } from './configs/jwt.config';
import { getRmqConfig } from './configs/rmq.config';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    RMQModule.forRoot(getRmqConfig()),
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule.register({})
  ],
  controllers: [
    AuthController
  ]
})
export class AppModule { }
