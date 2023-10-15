import { PaymentCheck, PaymentStatus } from "@courses/contracts";
import { PurchaseState } from "@courses/interfaces";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStatePayment extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Оплата курса в процессе");
  }
  public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    const [courseId, user] = [this.saga.courseId, this.saga.user];

    const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      courseId,
      userId: user._id
    });

    switch (status) {
      case 'canceled':
        this.saga.setState(PurchaseState.Canceled, courseId);
      case 'success':
        user.updateCourseState(courseId, PurchaseState.Purchased);
        break;
    }

    return { user, status };
  }
  public async cancelPayment(): Promise<{ user: UserEntity; }> {
    throw new Error("Нельзя отменить во время платежа");
  }

}
