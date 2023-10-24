import { AccountLogin, AccountRegister } from '@courses/contracts';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { getMongoConfig } from '../../configs/mongo.config';
import { UserRepository } from '../user/repositories/user.repository';
import { UserModule } from '../user/user.module';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;

  const loginRequest: AccountLogin.Request = {
    email: 't.kayzer@gmail.com',
    password: '1212121',
  };

  const registerRequest: AccountRegister.Request = {
    ...loginRequest,
    displayName: '12121',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        RMQModule.forTest({}),
        MongooseModule.forRootAsync(getMongoConfig()),
      ],
    }).compile();
    app = module.createNestApplication();

    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);
    await app.init();
  });

  it('Register', async () => {
    const response = await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, registerRequest);

    expect(response.email).toBe(registerRequest.email);
  });

  it('Login', async () => {
    const response = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, loginRequest);

    expect(response.accessToken).toBeDefined();
  });

  afterAll(async () => {
    await userRepository.deleteUser(registerRequest.email);
    app.close();
  });
});
