import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OpenAiService } from './open-ai';

import * as fs from 'fs';
import { AudioToTextType } from './types/audio-to-text.type';

@Injectable()
export class AudioToText {
  logger = new Logger(AudioToText.name);

  constructor(private readonly openAiServ: OpenAiService) {}

  async audioTotextUseCase({ file, prompt }: AudioToTextType) {
    try {
      this.logger.log('Iniciando consulta al openai...');

      const transcription =
        await this.openAiServ.openIa.audio.transcriptions.create({
          file: fs.createReadStream(file.path),
          model: 'whisper-1',
          language: 'es',
          response_format: 'vtt',
          prompt,
        });

      this.logger.log('La respuesta de openai...');
      this.logger.log(transcription);

      return transcription;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Se ha producido al generar el audio to text',
      );
    }
  }
}
