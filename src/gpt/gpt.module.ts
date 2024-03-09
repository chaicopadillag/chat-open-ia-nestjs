import { Module } from '@nestjs/common';
import { Orthography, ProsConsDiscusser } from '../core';
import { OpenIaService } from '../core/openia';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  controllers: [GptController],
  providers: [OpenIaService, GptService, Orthography, ProsConsDiscusser],
})
export class GptModule {}
