import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/user.model";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";

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

  async deleteUser(email: string) {
    return await this.userModel.deleteOne({ email });
  }
}
