export interface ValidationMiddleware {
  handle(request: any, response: any, next?: any): Promise<any>;
}
