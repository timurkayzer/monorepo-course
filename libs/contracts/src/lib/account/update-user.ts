import { IUser } from '@courses/interfaces';
import { IsObject, IsString } from 'class-validator';

export namespace UpdateUserCommand {
  export const topic = 'account.update-user.command';

  export class Request {
    @IsString()
    id!: string;
    @IsObject()
    user!: Partial<IUser>;
  }

  export class Response {
    success!: boolean;
  }
}

