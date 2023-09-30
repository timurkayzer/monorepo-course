import { IUser } from "@courses/interfaces";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "../entities/user.entity";
import { User } from "../models/user.model";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) { }

  async createUser(user: UserEntity): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: string): Promise<Omit<User, 'passwordHash'>> {
    return await this.userModel.findById(id).projection({ passwordHash: 0 }) as Omit<User, 'passwordHash'>;
  }

  async deleteUser(email: string) {
    return await this.userModel.deleteOne({ email });
  }

  async updateUser(id: string, user: Partial<IUser>) {
    return await this.userModel.updateOne({ _id: id }, user);
  }
}
