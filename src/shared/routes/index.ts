import { createUsersRoutes } from "@/modules/users/infra/routes/users.routes";
import { ValidationMiddleware } from "@/shared/protocols/middlewares/validation-middleware";
import { Router } from "express";

export const createRoutes = (
  userValidationMiddleware?: ValidationMiddleware
): Router => {
  const routes = Router();
  routes.use("/users", createUsersRoutes());
  return routes;
};
