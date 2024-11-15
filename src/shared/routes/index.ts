import { Router } from 'express';
import { ValidationMiddleware } from '../protocols/middlewares/validation-middleware';

export const createRoutes = (userValidationMiddleware?: ValidationMiddleware): Router => {
  const routes = Router();
  return routes;
};
