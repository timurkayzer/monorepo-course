import { CourseGetCourse, PaymentGenerateLink } from "@courses/contracts";
import { PurchaseState } from "@courses/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId
    });

    if (!course) throw new Error("Курс не существует");

    if (course.price === 0) {
      this.saga.user.updateCourseState(course._id, PurchaseState.Purchased);
      return { paymentLink: null, user: this.saga.user };
    }

    const { link } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      price: course.price
    });

    return { paymentLink: link, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity; }> {
    throw new Error("Нельзя проверить платеж, который не был проведен");
  }
  public async cancelPayment(): Promise<{ user: UserEntity; }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user };
  }

}
