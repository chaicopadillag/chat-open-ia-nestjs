import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {
  AudioToText,
  ImageGeneration,
  ImageVariation,
  Orthography,
  ProsConsDiscusser,
  TextToAudio,
  Translation,
} from '../core';
import { OpenAiService } from '../core/open-ai';
import DownloadImageService from './../helpers/download-image-by-url';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  imports: [HttpModule],
  controllers: [GptController],
  providers: [
    OpenAiService,
    GptService,
    Orthography,
    ProsConsDiscusser,
    Translation,
    TextToAudio,
    AudioToText,
    ImageGeneration,
    DownloadImageService,
    ImageVariation,
  ],
})
export class GptModule {}
