import { IsNumber, IsString } from 'class-validator';

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.command';

  export class Request {
    @IsString()
    courseId!: string;

    @IsString()
    userId!: string;

    @IsNumber()
    price!: number;
  }

  export class Response {
    link!: string;
  }
}

