import { PaymentStatus } from "@courses/contracts";
import { PurchaseState } from "@courses/interfaces";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Нельзя оплатить отмененный курс");
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    throw new Error("Нельзя проверить платеж, который не был проведен");
  }
  public async cancelPayment(): Promise<{ user: UserEntity; }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user };
  }

}
