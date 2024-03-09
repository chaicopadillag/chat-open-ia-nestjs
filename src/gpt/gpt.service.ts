import { Injectable } from '@nestjs/common';
import { Orthography, ProsConsDiscusser } from '../core';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Injectable()
export class GptService {
  constructor(
    private readonly orthography: Orthography,
    private readonly prosConsServ: ProsConsDiscusser,
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
}
