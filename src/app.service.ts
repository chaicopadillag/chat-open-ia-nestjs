import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { appConfig } from './env';

@Injectable()
export class AppService {
  constructor(
    @Inject(appConfig.KEY)
    private envApp: ConfigType<typeof appConfig>,
  ) {}
  checkhealth() {
    return {
      appName: this.envApp.appName,
      version: this.envApp.appVersion,
    };
  }
}
