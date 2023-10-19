import { IUser } from "@courses/interfaces";
import { Injectable, Logger } from "@nestjs/common";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmitter } from "./user.eventemitter";

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
  ) { }

  async updateUser(id: string, user: Partial<IUser>) {
    try {
      const existingUser = await this.userRepository.findUserById(id);
      if (!existingUser) throw "User not found";
      const userEntity = new UserEntity(existingUser);
      userEntity.updateProfile(user);
      await this.userEventEmitter.handle(userEntity);
      return { success: true };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      return { success: false };
    }
  }

  async buyCourse(userId: string, courseId: string) {
    try {
      const userExists = await this.userRepository.findUserById(userId);
      if (!userExists) throw new Error("Пользователь не найден");
      const userEntity = new UserEntity(userExists);

      const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
      const { paymentLink, user } = await saga.getState().pay();
      await this.userRepository.updateUser(userId, user);
      await this.userEventEmitter.handle(userEntity);
      return { paymentLink };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      throw new Error(`Ошибка при покупке курса - ${e?.message}`);
    }
  }

  async checkPayment(userId: string, courseId: string) {
    try {
      const userExists = await this.userRepository.findUserById(userId);
      if (!userExists) throw new Error("Пользователь не найден");
      const userEntity = new UserEntity(userExists);

      const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
      const { status, user } = await saga.getState().checkPayment();
      await this.userRepository.updateUser(userId, user);
      await this.userEventEmitter.handle(userEntity);
      return { status };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      throw new Error(`Ошибка при покупке курса - ${e?.message}`);

    }
  }
}
