import { UserRole } from '@courses/interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {

  }

  async register({ email, password, displayName }: RegisterDto) {
    const foundUser = await this.userRepository.findUser(email);

    if (foundUser) throw new Error("Пользователь уже существует");

    const userEntity = new UserEntity({
      displayName,
      email,
      role: UserRole.Student,
      passwordHash: ''
    });

    await userEntity.setPassword(password);

    return this.userRepository.createUser(userEntity);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);

    if (!user) throw new Error("Неверный логин или пароль");

    const userEntity = new UserEntity(user);
    const isValid = await userEntity.validatePassword(password);

    if (!isValid) throw new Error("Неверный логин или пароль");

    return user;

  }

  async login(id: string) {
    return {
      accessToken: await this.jwtService.signAsync({ id })
    };
  }
}
