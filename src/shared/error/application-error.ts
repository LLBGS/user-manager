import { StatusCode } from '@/shared/enum/status-code';

export class ApplicationError extends Error {
  constructor(
    readonly statusCode: StatusCode,
    readonly message: string,
    readonly name: string,
  ) {
    super(message);
    this.name = name;
  }
}
