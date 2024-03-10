import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TranslationDto } from '../gpt/dtos';
import { OpenAiService } from './open-ai';

@Injectable()
export class Translation {
  logger = new Logger(Translation.name);
  constructor(private readonly openIaServ: OpenAiService) {}

  async translateUseCase({ lang, prompt }: TranslationDto) {
    try {
      this.logger.log('Iniciando consulta al open ia...');
      const resp = await this.openIaServ.openIa.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You will be provided with a sentence, and your task is to translate it into ${lang}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo-16k-0613',
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });
      this.logger.log('Respuesta de openai...', resp.choices[0].message);
      return resp.choices[0].message;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al traducir el texto, por favor intenta con otro texto',
      );
    }
  }
}
