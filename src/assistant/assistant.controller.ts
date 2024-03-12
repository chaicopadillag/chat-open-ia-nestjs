import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantDto } from './dtos/assistant.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('create-thread')
  async createThread() {
    return this.assistantService.createThread();
  }

  @Post('create-message')
  async createMessageInThread(@Body() dto: AssistantDto) {
    return this.assistantService.createMessageInThread(dto);
  }
}
