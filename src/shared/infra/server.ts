import { Logger } from '@/shared/adapters/logger/logger';
import swaggerJson from '@/shared/infra/swagger.json';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { Express, Router } from 'express';
import helmet from 'helmet';
import * as http from 'http';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './error/error-handler';
export class Server {
  private readonly app: Express;
  private server!: http.Server;
  private logger = new Logger().logger;

  constructor(private readonly port: number, private readonly routes: Router) {
    this.app = express();
    this.setup();
  }

  private setup(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(cors());
  }

  private errors(): void {
    try {
      this.app.use(errors());
      this.app.use(errorHandler);
    } catch (error) {
      this.logger.error(`Error on setup errors: ${error}`);
    }
  }

  private setupSwagger(): void {
    try {
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
    } catch (error) {
      this.logger.error(`Error on setup swagger: ${error}`);
    }
  }

  private startHealthCheck(): void {
    try {
      this.app.get('/healthCheck', (request, response) => {
        response.status(200).json({ message: 'Server is running' });
      });
    } catch (error) {
      this.logger.error(`Error on start health check: ${error}`);
    }
  }

  private startServer(): void {
    try {
      this.server = this.app.listen(this.port, () => {
        this.logger.info(`Server running on port ${this.port}`);
      });
    } catch (error) {
      this.logger.error(`Error on start server: ${error}`);
    }
  }

  public init(): void {
    this.startServer();
    this.startHealthCheck();
    this.setupSwagger();
    this.errors();
  }

  public close(): void {
    this.server.close();
  }
}
