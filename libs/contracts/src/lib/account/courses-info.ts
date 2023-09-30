import { IUserCourse } from '@courses/interfaces';
import { IsString } from 'class-validator';

export namespace AccountCoursesInfoQuery {
  export const topic = 'account.courses-info.query';

  export class Request {
    @IsString()
    id!: string;
  }

  export class Response {
    courses!: IUserCourse[];
  }
}

