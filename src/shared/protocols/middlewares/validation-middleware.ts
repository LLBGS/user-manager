import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}
export interface ValidationMiddleware {
  handle(
    request: AuthenticatedRequest,
    response: any,
    next?: any
  ): Promise<any>;
}
