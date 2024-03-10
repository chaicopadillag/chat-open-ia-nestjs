import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProsConsDiscusserDto } from 'src/gpt/dtos';
import { OpenAiService } from './open-ai';

@Injectable()
export class ProsConsDiscusser {
  logger = new Logger(ProsConsDiscusser.name);
  constructor(private readonly openAiServ: OpenAiService) {}

  async prosConsDiscusserUseCase({ prompt }: ProsConsDiscusserDto) {
    try {
      this.logger.log('Iniciando consulta al open ia...');
      const resp = await this.openAiServ.openIa.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
            Dame una respuesta con pros y contras cuando te pregunto y en formato Markdown oses enrequecido con etiquetas posible,
            Ejemplo de la salida:
            {title}:
            
            Pros:
            - 
            -
            -

            Contras:
            - 
            -
            -`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo-1106',
        max_tokens: 500,
      });

      return resp.choices[0].message;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al procesar tu pregunta, por favor intenta con otro texto',
      );
    }
  }

  async prosConsStreamUseCase({ prompt }: ProsConsDiscusserDto) {
    try {
      this.logger.log('Iniciando consulta al open ia...');
      return await this.openAiServ.openIa.chat.completions.create({
        stream: true,
        messages: [
          {
            role: 'system',
            content: `
            Dame una respuesta con pros y contras cuando te pregunto y en formato Markdown oses enrequecido con etiquetas posible,
            Ejemplo de la salida:
            {{title}}:
            
            Pros:
            - 
            -
            -

            Contras:
            - 
            -
            -

  `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo-1106',
        max_tokens: 500,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al procesar tu pregunta, por favor intenta con otro texto',
      );
    }
  }
}
