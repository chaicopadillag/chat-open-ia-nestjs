import { Module } from '@nestjs/common';
import { Assistant } from '../core/assistant';
import { OpenAiService } from '../core/open-ai';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService, OpenAiService, Assistant],
})
export class AssistantModule {}
