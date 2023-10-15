import { PurchaseState } from "@courses/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStateCanceled } from "./steps/buy-course.canceled.steps";
import { BuyCourseSagaStatePayment } from "./steps/buy-course.payment.steps";
import { BuyCourseSagaStatePurchased } from "./steps/buy-course.purchased.steps";
import { BuyCourseSagaStateStarted } from "./steps/buy-course.started.steps";


export class BuyCourseSaga {
  public state: BuyCourseSagaState;

  constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) { }

  setState(state: PurchaseState, courseId: string) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.Canceled:
        this.state = new BuyCourseSagaStateCanceled();
        break;
      case PurchaseState.WaitingForPayment:
        this.state = new BuyCourseSagaStatePayment();
        break;
      case PurchaseState.Purchased:
        this.state = new BuyCourseSagaStatePurchased();
        break;
    }

    this.user.updateCourseState(courseId, state);

  }

  getState() {
    return this.state;
  }
}
