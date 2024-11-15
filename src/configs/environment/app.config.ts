import * as dotenv from 'dotenv';
dotenv.config();

interface IAppConfig {
  port: number;
  nodeEnv: string;
  appName: string;
}

export class AppConfig {
  private static requiredEnvs = ['PORT', 'NODE_ENV'];
  private static _environment: IAppConfig;
  private static environmentNames = ['development', 'production', 'qas', 'uat'];

  static get environment(): IAppConfig {
    if (typeof this._environment === 'undefined') {
      this.validateIfRequiredEnvsArePresent();
      this._environment = this.mountEnvironment();
    }
    return this._environment;
  }

  static validateIfRequiredEnvsArePresent() {
    this.requiredEnvs.forEach((env) => {
      if (typeof process.env[env] === 'undefined') {
        throw new Error(`Environment variable ${env} is missing`);
      }
    });
  }

  static mountEnvironment(): IAppConfig {
    const port = this.validatePort(Number(process.env.PORT));
    const nodeEnv = this.validateNodeEnv(String(process.env.NODE_ENV));
    const appName = this.validateAppName(String(process.env.APP_NAME));

    return {
      port,
      nodeEnv,
      appName,
    };
  }

  private static validateAppName(appName: string): string {
    if (appName === 'undefined' || appName === '') {
      throw new Error(
        `Invalid value for APP_NAME environment variable: ${process.env.APP_NAME}`,
      );
    }
    return appName;
  }

  private static validatePort(port: number): number {
    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid value for PORT environment variable: ${process.env.PORT}`);
    }
    return port;
  }

  private static validateNodeEnv(nodeEnv: string): string {
    if (!this.environmentNames.includes(nodeEnv)) {
      throw new Error(
        `Invalid value for NODE_ENV environment variable: ${process.env.NODE_ENV}`,
      );
    }
    return nodeEnv;
  }
}
