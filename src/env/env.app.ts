import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('appConfig', () => ({
  port: Number(process.env.PORT || 8082),
  appDomain: process.env.APP_DOMAIN || 'http://localhost:8080',
  appName: process.env.APP_NAME || 'GTP',
  appVersion: process.env.APP_VERSION || 'v0.0.1',
}));
