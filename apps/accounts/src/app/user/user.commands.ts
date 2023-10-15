import { AccountBuyCourse, PaymentCheck, UpdateUserCommand } from '@courses/contracts';
import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Controller('auth')
export class UserCommands {
  constructor(
    private userRepository: UserRepository,
    private rmqService: RMQService
  ) {

  }

  @RMQValidate()
  @RMQRoute(UpdateUserCommand.topic)
  async register(@Body() { id, user }: UpdateUserCommand.Request): Promise<UpdateUserCommand.Response> {
    try {
      const existingUser = await this.userRepository.findUserById(id);
      if (!existingUser) throw "User not found";
      const userEntity = new UserEntity(existingUser);
      userEntity.updateProfile(user);

      return { success: true };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      return { success: false };

    }
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(@Body() { courseId, userId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    try {
      const userExists = await this.userRepository.findUserById(userId);
      if (!userExists) throw new Error("Пользователь не найден");
      const userEntity = new UserEntity(userExists);

      const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
      const { paymentLink, user } = await saga.getState().pay();
      await this.userRepository.updateUser(userId, user);
      return { paymentLink };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      throw new Error(`Ошибка при покупке курса - ${e?.message}`);
    }
  }

  @RMQValidate()
  @RMQRoute(PaymentCheck.topic)
  async checkPayment(@Body() { courseId, userId }: PaymentCheck.Request): Promise<PaymentCheck.Response> {
    try {
      const userExists = await this.userRepository.findUserById(userId);
      if (!userExists) throw new Error("Пользователь не найден");
      const userEntity = new UserEntity(userExists);

      const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
      const { status, user } = await saga.getState().checkPayment();
      await this.userRepository.updateUser(userId, user);

      return { status };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      throw new Error(`Ошибка при покупке курса - ${e?.message}`);

    }
  }

}


