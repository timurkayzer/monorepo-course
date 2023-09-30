import { AccountCoursesInfoQuery, AccountUserInfoQuery } from '@courses/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';

@Controller('auth')
export class UserQueries {

  constructor(
    private userRepository: UserRepository
  ) { }

  @RMQValidate()
  @RMQRoute(AccountUserInfoQuery.topic)
  async userInfo(@Body() dto: AccountUserInfoQuery.Request): Promise<AccountUserInfoQuery.Response> {
    const user = await this.userRepository.findUserById(dto.id);
    return { user };
  }

  @RMQValidate()
  @RMQRoute(AccountCoursesInfoQuery.topic)
  async userCourses(@Body() dto: AccountCoursesInfoQuery.Request): Promise<AccountCoursesInfoQuery.Response> {
    const user = await this.userRepository.findUserById(dto.id);
    return { courses: user.courses };
  }



}
