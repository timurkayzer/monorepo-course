import { IUser, IUserCourse, UserRole } from "@courses/interfaces";
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourse[];

  constructor(user: Omit<IUser, 'passwordHash'> & { passwordHash?: string; }) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.passwordHash = user.passwordHash || '';
    this.email = user.email;
    this.courses = user.courses;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async validatePassword(password: string) {
    return await compare(password, this.passwordHash);
  }

  public updateProfile(user: Partial<IUser>): void {

  }
}
