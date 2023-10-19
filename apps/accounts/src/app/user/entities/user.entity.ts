import { AccountChangedCourse } from "@courses/contracts";
import { IDomainEvent, IUser, IUserCourse, PurchaseState, UserRole } from "@courses/interfaces";
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourse[];
  events: IDomainEvent[];

  constructor(user: Omit<IUser, 'passwordHash'> & { passwordHash?: string; }) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.passwordHash = user.passwordHash || '';
    this.email = user.email;
    this.courses = user.courses;
    this.events = [];
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public updateCourseState(courseId: string, state: PurchaseState) {
    if (this.courses.findIndex(c => c.courseId === courseId) !== -1) {
      this.courses.push({
        courseId: courseId,
        purchaseState: state
      });
    }

    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter(c => courseId !== c.courseId);
    }

    this.courses = this.courses.map(c => {
      if (c.courseId === courseId) {
        c.purchaseState = state;
      }

      return c;
    });

    this.events.push({
      topic: AccountChangedCourse.topic,
      data: <AccountChangedCourse.Request>{
        courseId,
        status: state,
        userId: this._id
      }
    });

    return this;
  }

  public async validatePassword(password: string) {
    return await compare(password, this.passwordHash);
  }

  public updateProfile(user: Partial<IUser>): void {

  }
}
