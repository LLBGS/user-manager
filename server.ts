import { errorHandler } from '@/shared/infra/error/error-handler';
import swaggerJson from '@/shared/infra/swagger.json';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { Express, Router } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import * as http from 'http';
import swaggerUi from 'swagger-ui-express';
export class Server {
  private readonly app: Express;
  private server: http.Server;

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
    this.app.use(errors());
    this.app.use(errorHandler);
  }

  private setupSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
  }

  init(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
    this.app.get('/healthCheck', (req, res) =>
      res.status(200).send({
        appName: process.env.APP_NAME,
        version: process.env.APP_VERSION,
        running: true,
      }),
    );
    this.app.use(this.routes);
    this.setupSwagger();
    this.errors();
  }

  async close(): Promise<void> {
    this.server.close();
  }
}
