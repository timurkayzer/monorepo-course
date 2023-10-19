import { AccountBuyCourse, PaymentCheck, UpdateUserCommand } from '@courses/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserService } from './user.service';

@Controller('auth')
export class UserCommands {
  constructor(
    private userService: UserService,
  ) {

  }

  @RMQValidate()
  @RMQRoute(UpdateUserCommand.topic)
  async updateUser(@Body() { id, user }: UpdateUserCommand.Request): Promise<UpdateUserCommand.Response> {
    return await this.userService.updateUser(id, user);
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(@Body() { courseId, userId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    return await this.userService.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(PaymentCheck.topic)
  async checkPayment(@Body() { courseId, userId }: PaymentCheck.Request): Promise<PaymentCheck.Response> {
    return await this.userService.checkPayment(userId, courseId);
  }

}


