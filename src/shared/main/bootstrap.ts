import { AppConfig } from "@/configs/environment/app.config";
import { PrismaOrmAdapter } from "@/shared/adapters/database/prisma.database";
import { Server } from "@/shared/infra/server";
import { createRoutes } from "@/shared/routes";
const database = new PrismaOrmAdapter();
const server = new Server(AppConfig.environment.port, createRoutes(), database);
server.init();
