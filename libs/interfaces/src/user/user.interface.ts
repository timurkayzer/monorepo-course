export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student'
}

export interface IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourse[];
}

export interface IUserCourse {
  courseId: string;
  purchaseState: PurchaseState;
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled'
}
