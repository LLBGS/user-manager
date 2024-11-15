import { AppConfig } from '@/configs/environment/app.config';
import { Server } from '@/shared/infra/server';
import { createRoutes } from '@/shared/routes';
const server = new Server(AppConfig.environment.port, createRoutes());
server.init();
