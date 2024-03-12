import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Assistant } from '../core/assistant';
import { AssistantDto } from './dtos/assistant.dto';

@Injectable()
export class AssistantService {
  constructor(private readonly assistant: Assistant) {}

  async createThread() {
    return this.assistant.createThreadUseCase();
  }

  async createMessageInThread(dto: AssistantDto) {
    await this.assistant.createMessageInThreadUseCase(dto);
    const run = await this.assistant.createRunAssistantUseCase(dto.threadId);
    await lastValueFrom(this.assistant.checkRunStatus(run.id, dto.threadId));
    const messages = await this.assistant.getMessagesList(dto.threadId);
    return messages;
  }
}
