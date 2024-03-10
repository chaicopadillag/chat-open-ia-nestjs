import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import { openAiConfig } from '../../env/env.open-ai';

@Injectable()
export class OpenAiService {
  private _openai: OpenAI;

  constructor(
    @Inject(openAiConfig.KEY)
    private openAiEnv: ConfigType<typeof openAiConfig>,
  ) {
    this._openai = new OpenAI({ apiKey: this.openAiEnv.openAiKey });
  }

  get openIa() {
    return this._openai;
  }
}
