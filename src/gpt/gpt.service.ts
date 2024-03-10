import { Injectable } from '@nestjs/common';
import { Orthography, ProsConsDiscusser, Translation } from '../core';
import { OrthographyDto, ProsConsDiscusserDto, TranslationDto } from './dtos';

@Injectable()
export class GptService {
  constructor(
    private readonly orthography: Orthography,
    private readonly prosConsServ: ProsConsDiscusser,
    private readonly translateServ: Translation,
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
}
