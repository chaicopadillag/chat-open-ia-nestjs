import { Module } from '@nestjs/common';
import { Orthography, ProsConsDiscusser, Translation } from '../core';
import { OpenAiService } from '../core/open-ai';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  controllers: [GptController],
  providers: [
    OpenAiService,
    GptService,
    Orthography,
    ProsConsDiscusser,
    Translation,
  ],
})
export class GptModule {}