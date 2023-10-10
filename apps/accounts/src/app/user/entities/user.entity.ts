import { IUser, IUserCourse, PurchaseState, UserRole } from "@courses/interfaces";
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

  public addCourse(courseId: string): void {
    if (this.courses.findIndex(c => c.courseId === courseId) !== -1) {
      throw new Error("Course already added");
    }

    this.courses.push({
      courseId,
      purchaseState: PurchaseState.WaitingForPayment
    });
  }

  public deleteCourse(courseId: string): void {
    this.courses = this.courses.filter(c => courseId !== c.courseId);
  }

  public updateCourseState(courseId: string, state: PurchaseState): void {
    this.courses = this.courses.map(c => {
      if (c.courseId === courseId) {
        c.purchaseState = state;
      }

      return c;
    });
  }

  public async validatePassword(password: string) {
    return await compare(password, this.passwordHash);
  }

  public updateProfile(user: Partial<IUser>): void {

  }
}
