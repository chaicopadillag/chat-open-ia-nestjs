import { Module } from '@nestjs/common';
import {
  AudioToText,
  Orthography,
  ProsConsDiscusser,
  TextToAudio,
  Translation,
} from '../core';
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
    TextToAudio,
    AudioToText,
  ],
})
export class GptModule {}
