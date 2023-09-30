import { UpdateUserCommand } from '@courses/contracts';
import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';

@Controller('auth')
export class UserCommands {
  constructor(
    private userRepository: UserRepository
  ) {

  }

  @RMQValidate()
  @RMQRoute(UpdateUserCommand.topic)
  async register(@Body() { id, user }: UpdateUserCommand.Request): Promise<UpdateUserCommand.Response> {
    try {
      await this.userRepository.updateUser(id, user);
      return { success: true };
    }
    catch (e) {
      Logger.error("Error while updating user, " + e?.toString());
      return { success: false };

    }
  }

}
