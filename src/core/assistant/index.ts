import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Observable, from, of, switchMap, timer } from 'rxjs';
import { openAiConfig } from 'src/env';
import { AssistantDto } from '../../assistant/dtos/assistant.dto';
import { OpenAiService } from '../open-ai';

@Injectable()
export class Assistant {
  private logger = new Logger(Assistant.name);

  constructor(
    @Inject(openAiConfig.KEY)
    private openAiEnv: ConfigType<typeof openAiConfig>,
    private readonly openAiServ: OpenAiService,
  ) {}

  async createThreadUseCase() {
    const resp = await this.openAiServ.openIa.beta.threads.create();

    this.logger.debug(`Created thread with...${JSON.stringify(resp, null, 2)}`);

    return {
      id: resp.id,
    };
  }

  async createMessageInThreadUseCase({ threadId, content }: AssistantDto) {
    this.logger.debug(
      `Start create message in thread with: ${JSON.stringify({ threadId, content }, null, 2)}`,
    );

    const resp = await this.openAiServ.openIa.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content,
      },
    );

    this.logger.debug(
      `Finish created message at thread response: ${JSON.stringify(resp, null, 2)}`,
    );

    return resp;
  }

  async createRunAssistantUseCase(threadId: string) {
    this.logger.debug(`Start create run thread with: ${threadId}`);

    const resp = await this.openAiServ.openIa.beta.threads.runs.create(
      threadId,
      {
        assistant_id: this.openAiEnv.assistantId,
      },
    );

    this.logger.debug(
      `Finish created run thread response: ${JSON.stringify(resp, null, 2)}`,
    );

    return resp;
  }

  checkRunStatus(runId: string, threadId: string): Observable<Run> {
    return from(
      this.openAiServ.openIa.beta.threads.runs.retrieve(threadId, runId),
    ).pipe(
      switchMap((resp) => {
        this.logger.debug(`Check the Run status, status in: ${resp.status}`);
        if (resp.status === 'completed') {
          return of(resp);
        } else {
          return timer(1000).pipe(
            switchMap(() => this.checkRunStatus(runId, threadId)),
          );
        }
      }),
    );
  }

  async getMessagesList(threadId: string) {
    this.logger.debug(`Start get messages list of threadId: ${threadId}`);
    const resp = await this.openAiServ.openIa.beta.threads.messages.list(
      threadId,
      {
        order: 'desc',
      },
    );

    this.logger.debug(
      `Response open ai list messages: ${JSON.stringify(resp.data, null, 2)}`,
    );

    const messages = resp.data.map((m: any) => ({
      role: m.role,
      content: m.content[0].text.value,
    }));

    return messages;
  }
}
