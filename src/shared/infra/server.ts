import { Logger } from "@/shared/adapters/logger/logger";
import swaggerJson from "@/shared/infra/swagger.json";
import { DatabaseProtocol } from "@/shared/protocols/databases/database.protocol";
import { errors } from "celebrate";
import cors from "cors";
import express, { Express, Router } from "express";
import helmet from "helmet";
import * as http from "http";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./error/error-handler";
export class Server {
  private readonly app: Express;
  private server!: http.Server;
  private logger = new Logger().logger;

  constructor(
    private readonly port: number,
    private readonly routes: Router,
    private readonly database: DatabaseProtocol
  ) {
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
      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
    } catch (error) {
      this.logger.error(`Error on setup swagger: ${error}`);
    }
  }

  private startHealthCheck(): void {
    try {
      this.app.get("/healthCheck", (request, response) => {
        response.status(200).json({ message: "Server is running" });
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
  public setupRoutes(): void {
    try {
      this.app.use(this.routes);
    } catch (error) {
      this.logger.error(`Error on setup routes: ${error}`);
    }
  }
  public setupDatabase(): void {
    try {
      this.database.connect();
    } catch (error) {
      this.logger.error(`Error on setup database: ${error}`);
    }
  }

  public init(): void {
    this.startServer();
    this.startHealthCheck();
    this.setupSwagger();
    this.setupDatabase();
    this.setupRoutes();
    this.errors();
  }

  public close(): void {
    this.server.close();
  }
}
