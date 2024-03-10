import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, database, openAiConfig } from './env';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, database, openAiConfig],
    }),
    GptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
