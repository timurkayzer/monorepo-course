import { AccountLogin, AccountRegister } from '@courses/contracts';
import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {

  }

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    try {
      return await this.authService.register(dto);
    }
    catch (e) {
      Logger.error("Error while working on register message, " + e?.toString());
      return e;
    }
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    try {
      const user = await this.authService.validateUser(email, password);
      return this.authService.login(user.id);
    }
    catch (e) {
      Logger.error("Error while working on login message, " + e?.toString());
      return e;
    }
  }
}
