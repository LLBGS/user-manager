import { StatusCode } from '@/shared/enum/status-code';
import { ApplicationError } from '@/shared/error/application-error';
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error);
  if (error instanceof ApplicationError) {
    return response.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      classError: error.constructor.name,
    });
  }
  return response.status(StatusCode.internalServerError).json({
    statusCode: StatusCode.internalServerError,
    message: 'Internal server error',
  });
};
