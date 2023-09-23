import { AccountLogin, AccountRegister } from "@courses/contracts";
import { Body, Controller, Post, UnauthorizedException, UsePipes, ValidationPipe } from "@nestjs/common";
import { RMQService } from "nestjs-rmq";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly rmqService: RMQService
  ) {

  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, dto);
    }
    catch (e) {
      throw new UnauthorizedException(e?.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, dto);
    }
    catch (e) {
      throw new UnauthorizedException(e?.message);
    }
  }

}
