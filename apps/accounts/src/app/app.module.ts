import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule } from 'nestjs-rmq';
import { getMongoConfig } from '../configs/mongo.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    RMQModule.forRoot({
      exchangeName: process.env.AMQP_EXCHANGE || 'account',
      connections: [
        {
          host: process.env.AMQP_EXCHANGE || 'localhost',
          login: process.env.AMQP_LOGIN || 'guest',
          password: process.env.AMQP_PASSWORD || 'guest',
        }
      ],
      queueName: process.env.AMQP_QUEUE || 'accounts',
      prefetchCount: 33,
      serviceName: 'accounts'
    }),
    MongooseModule.forRootAsync(getMongoConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
