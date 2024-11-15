import { AppConfig } from '@/configs/environment/app.config';
import dotenv from 'dotenv';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe(`${AppConfig.name} - Unit Tests`, () => {
  beforeAll(() => {
    dotenv.config = jest.fn().mockReturnValue({
      parsed: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
    });
  });

  it('should throw an error if required environment variables are missing', () => {
    expect(() => {
      AppConfig.validateIfRequiredEnvsArePresent();
    }).toThrowError('Environment variable PORT is missing');
  });

  it('should throw an error if PORT environment variable is invalid', () => {
    delete process.env.PORT;
    process.env.NODE_ENV = 'development';
    expect(() => {
      AppConfig.validateIfRequiredEnvsArePresent();
    }).toThrowError('Environment variable PORT is missing');
  });

  it('should throw an error if NODE_ENV environment variable is invalid', () => {
    delete process.env.NODE_ENV;
    process.env.PORT = '3000';
    expect(() => {
      AppConfig.validateIfRequiredEnvsArePresent();
    }).toThrowError('Environment variable NODE_ENV is missing');
  });

  it('should validate the port correctly', () => {
    process.env.PORT = '0';
    process.env.NODE_ENV = 'development';
    process.env.APP_NAME = 'MyApp';
    expect(() => {
      AppConfig.mountEnvironment();
    }).toThrowError(`Invalid value for PORT environment variable: ${process.env.PORT}`);
  });

  it('should validate the nodeEnv correctly', () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'invalid';
    process.env.APP_NAME = 'MyApp';
    expect(() => {
      AppConfig.mountEnvironment();
    }).toThrowError(
      `Invalid value for NODE_ENV environment variable: ${process.env.NODE_ENV}`,
    );
  });

  it('should validate the appName correctly', () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'development';
    delete process.env.APP_NAME;
    expect(() => {
      AppConfig.mountEnvironment();
    }).toThrowError(
      `Invalid value for APP_NAME environment variable: ${process.env.APP_NAME}`,
    );
  });

  it('should mount the environment correctly', () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'development';
    process.env.APP_NAME = 'MyApp';
    const expectedEnvironment = {
      port: 3000,
      nodeEnv: 'development',
      appName: 'MyApp',
    };
    expect(AppConfig.mountEnvironment()).toEqual(expectedEnvironment);
  });

  it('should return the environment object', () => {
    const expectedEnvironment = {
      port: 3000,
      nodeEnv: 'development',
      appName: 'MyApp',
    };
    expect(AppConfig.environment).toEqual(expectedEnvironment);
  });
});
