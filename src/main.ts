import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './env';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const { port, appDomain } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  await app.listen(port, () => {
    logger.debug(`Run app chat GTP in port: ${appDomain}:${port}`);
  });
}
bootstrap();
