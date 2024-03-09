import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrthographyDto } from 'src/gpt/dtos';
import { OpenIaService } from './openia';

@Injectable()
export class Orthography {
  logger = new Logger(Orthography.name);
  constructor(private readonly openIaServ: OpenIaService) {}

  async orthographyUseCase({ prompt }: OrthographyDto) {
    try {
      this.logger.log('Iniciando consulta al open ia...');
      const completion = await this.openIaServ.openIa.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Corrige los errores ortográficos y gramaticales texto que se te envia, la Salida deber ser en formato JSON, el mensaje al usuario debe ser de acuerdo a la cantidad de errores.
  ejemplo:
  {
    "score": "{puntuacion}",
    "errors": [ "error->solucion" , "error->solucion" ],
    "message": "{mensaje_correccion}"
  }
  `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo-1106',
        max_tokens: 150,
        response_format: { type: 'json_object' },
      });
      this.logger.log(
        'Respuesta obtenida open ia:',
        completion.choices[0].message,
      );

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al procesar el texto, por favor intenta con otro texto',
      );
    }
  }
}
