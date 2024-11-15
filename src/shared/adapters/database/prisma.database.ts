import { AppConfig } from "@/configs/environment/app.config";
import { DatabaseProtocol } from "@/shared/protocols/databases/database.protocol";
import { PrismaClient } from "@prisma/client";

export class PrismaOrmAdapter extends PrismaClient implements DatabaseProtocol {
  constructor() {
    super({
      datasources: {
        db: {
          url: AppConfig.environment.dabaseUrl,
        },
      },
    });
  }

  async connect() {
    try {
      await this.$connect();
    } catch (error) {
      console.error("Error connecting to database", error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error("Error disconnecting from database", error);
      process.exit(1);
    }
  }
}
