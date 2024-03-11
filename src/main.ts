import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { appConfig } from './env';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { bodyParser: true });

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
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(port, () => {
    logger.debug(`Run app chat GTP in: ${appDomain}`);
  });
}
bootstrap();
