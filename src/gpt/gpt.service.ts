import { Injectable } from '@nestjs/common';
import {
  Orthography,
  ProsConsDiscusser,
  Translation,
  TextToAudio,
} from '../core';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslationDto,
} from './dtos';

@Injectable()
export class GptService {
  constructor(
    private readonly orthography: Orthography,
    private readonly prosConsServ: ProsConsDiscusser,
    private readonly translateServ: Translation,
    private readonly textToAudioServ: TextToAudio,
  ) {}

  orthographyCheck(orthographyDto: OrthographyDto) {
    return this.orthography.orthographyUseCase(orthographyDto);
  }

  prosConsDiscusser(prosConsDicusserDto: ProsConsDiscusserDto) {
    return this.prosConsServ.prosConsDiscusserUseCase(prosConsDicusserDto);
  }

  prosConsStream(prosConsDicusserDto: ProsConsDiscusserDto) {
    return this.prosConsServ.prosConsStreamUseCase(prosConsDicusserDto);
  }

  async translate(dtoTranslate: TranslationDto) {
    return this.translateServ.translateUseCase(dtoTranslate);
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return this.textToAudioServ.generateTextToAudioUseCase(textToAudioDto);
  }

  async getAudioFile(fileId: string) {
    return this.textToAudioServ.getAudioFile(fileId);
  }
}
