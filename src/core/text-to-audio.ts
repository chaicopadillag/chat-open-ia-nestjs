import * as fs from 'fs';
import * as path from 'path';

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TextToAudioDto } from '../gpt/dtos';
import { OpenAiService } from './open-ai';

import { VoicesType } from './types/text-to-audio.type';

@Injectable()
export class TextToAudio {
  logger = new Logger(TextToAudio.name);
  private audioFoler: string;
  constructor(private readonly openAiServ: OpenAiService) {
    this.audioFoler = path.resolve(__dirname, `./../../generated/audios`);
  }

  async generateTextToAudioUseCase({ prompt, voice }: TextToAudioDto) {
    const voices: VoicesType = {
      alloy: 'alloy',
      echo: 'echo',
      fable: 'fable',
      nova: 'nova',
      onyx: 'onyx',
      shimmer: 'shimmer',
    };

    try {
      const audioFile = path.resolve(
        __dirname,
        `${this.audioFoler}/${new Date().getTime()}.mp3`,
      );

      fs.mkdirSync(this.audioFoler, { recursive: true });

      this.logger.log('Iniciando consulta al openai...');

      voice = voices[voice] ?? 'alloy';

      const mp3 = await this.openAiServ.openIa.audio.speech.create({
        model: 'tts-1',
        voice,
        input: prompt,
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      fs.writeFileSync(audioFile, buffer);
      this.logger.log('Respuesta de openai... ' + mp3.statusText);
      return {
        audioFile,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Se ha producido al generar el texto a audio',
      );
    }
  }

  async getAudioFile(fileId: string) {
    const audioFile = path.resolve(
      __dirname,
      `${this.audioFoler}/${fileId}.mp3`,
    );

    if (!fs.existsSync(audioFile)) {
      throw new NotFoundException('Recurso no encontrodo');
    }

    return { audioFile };
  }
}
