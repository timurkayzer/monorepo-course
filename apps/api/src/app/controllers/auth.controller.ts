import { AccountLogin, AccountRegister } from "@courses/contracts";
import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";

@Controller('auth')
export class AuthController {

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: AccountLogin.Request): Promise<AccountLogin.Response> {

  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {

  }

}
