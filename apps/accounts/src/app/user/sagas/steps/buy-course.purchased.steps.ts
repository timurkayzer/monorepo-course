import { PaymentStatus } from "@courses/contracts";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Курс уже оплачен");
  }

  public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus; }> {
    throw new Error("Оплата за курс уже проведена");
  }

  public cancelPayment(): Promise<{ user: UserEntity; }> {
    throw new Error("Нельзя отменить купленный курс");
  }
}

