import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import { appConfig } from 'src/env';
import { ImageVariationDto } from 'src/gpt/dtos';
import DownloadImageService from '../helpers/download-image-by-url';
import { OpenAiService } from './open-ai';

@Injectable()
export class ImageVariation {
  private logger = new Logger(ImageVariation.name);

  constructor(
    @Inject(appConfig.KEY)
    private envApp: ConfigType<typeof appConfig>,
    private readonly openAiServ: OpenAiService,
    private readonly downloadServ: DownloadImageService,
  ) {}

  async imageVariationUseCase({ image }: ImageVariationDto) {
    try {
      const { pathImage } = await this.downloadServ.downloadImageAsPng(image);

      this.logger.debug(
        'Start generate image variation with open ai, img: ' + image,
      );

      const resp = await this.openAiServ.openIa.images.createVariation({
        image: fs.createReadStream(pathImage),
        model: 'dall-e-2',
        size: '1024x1024',
        response_format: 'url',
      });

      this.logger.debug(
        'Respuesta de open ai...',
        JSON.stringify(resp, null, 2),
      );

      const { imageName } = await this.downloadServ.downloadImageAsPng(
        resp.data[0].url,
      );

      return {
        imageUrl: `${this.envApp.appDomain}/gpt/image-generation/${imageName}`,
        revised_prompt: resp.data[0].revised_prompt,
        urlOpenAi: resp.data[0].url,
      };
    } catch (error) {
      if (error.response) {
        this.logger.error(error.response.status);
        this.logger.error(error.response.data);
      } else {
        this.logger.error(error.message);
      }
      throw new InternalServerErrorException(
        'Error al generar variacion de la imagen',
      );
    }
  }
}
