import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import { openIaConfig } from '../../env/env.open-ia';

@Injectable()
export class OpenIaService {
  private _openai: OpenAI;

  constructor(
    @Inject(openIaConfig.KEY)
    private openIaEnv: ConfigType<typeof openIaConfig>,
  ) {
    this._openai = new OpenAI({ apiKey: this.openIaEnv.openIaKey });
  }

  get openIa() {
    return this._openai;
  }
}
