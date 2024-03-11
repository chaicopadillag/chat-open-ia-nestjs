import { Injectable } from '@nestjs/common';
import {
  AudioToText,
  ImageGeneration,
  ImageVariation,
  Orthography,
  ProsConsDiscusser,
  TextToAudio,
  Translation,
} from '../core';
import { AudioToTextType } from '../core/types/audio-to-text.type';
import {
  ImageGerationDto,
  ImageVariationDto,
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
    private readonly audioToTextServ: AudioToText,
    private readonly imageGenerateServ: ImageGeneration,
    private readonly imageVariationServ: ImageVariation,
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

  async audioToText(audioToTextType: AudioToTextType) {
    return this.audioToTextServ.audioTotextUseCase(audioToTextType);
  }

  async imageGeneration(imageGenerationDto: ImageGerationDto) {
    return this.imageGenerateServ.imageGenerationUseCase(imageGenerationDto);
  }

  async imageGenerationByFileName(fileName: string) {
    return this.imageGenerateServ.imageGenerationByFileName(fileName);
  }

  async imageVariation(imageVariationDto: ImageVariationDto) {
    return this.imageVariationServ.imageVariationUseCase(imageVariationDto);
  }
}
