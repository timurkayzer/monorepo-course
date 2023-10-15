import { IUser, IUserCourse, PurchaseState, UserRole } from '@courses/interfaces';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class UserCourse extends Document implements IUserCourse {
  @Prop({ required: true })
  courseId: string;
  @Prop({ required: true, type: String, enum: PurchaseState })
  purchaseState: PurchaseState;
}

export const UserCourseSchema = SchemaFactory.createForClass(UserCourse);

@Schema()
export class User extends Document implements IUser {
  @Prop()
  displayName?: string;
  @Prop({
    required: true
  })
  email: string;
  @Prop({
    required: true
  })
  passwordHash: string;
  @Prop({
    enum: UserRole,
    type: String,
    default: UserRole.Student
  })
  role: UserRole;
  @Prop({
    type: [UserCourseSchema],
    _id: false
  })
  courses?: UserCourse[];
}

export const UserSchema = SchemaFactory.createForClass(User);
