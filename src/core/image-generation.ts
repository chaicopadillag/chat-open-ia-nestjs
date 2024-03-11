import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { appConfig } from '../env/env.app';
import { ImageGerationDto } from '../gpt/dtos';
import DownloadImageService from '../helpers/download-image-by-url';
import { OpenAiService } from './open-ai';

@Injectable()
export class ImageGeneration {
  private logger = new Logger(ImageGeneration.name);
  constructor(
    @Inject(appConfig.KEY)
    private envApp: ConfigType<typeof appConfig>,
    private readonly openAiServ: OpenAiService,
    private readonly downloadServ: DownloadImageService,
  ) {}

  async imageGenerationUseCase({
    prompt,
    originalImage,
    maskImage,
  }: ImageGerationDto) {
    try {
      if (!originalImage && !maskImage) {
        this.logger.debug(
          'Start generate image with open ai, prompt: ' + prompt,
        );

        const resp = await this.openAiServ.openIa.images.generate({
          prompt,
          model: 'dall-e-2',
          n: 1,
          size: '1024x1024',
          quality: 'standard',
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
      }

      this.logger.debug(
        'Start edit image with open ai...',
        JSON.stringify({
          prompt,
          originalImage,
          maskImage,
        }),
      );

      const { pathImage } =
        await this.downloadServ.downloadImageAsPng(originalImage);
      const { pathImageMask } =
        await this.downloadServ.downloadBase64ImageAsPng(maskImage);

      const resp = await this.openAiServ.openIa.images.edit({
        model: 'dall-e-2',
        prompt,
        image: fs.createReadStream(pathImage),
        mask: fs.createReadStream(pathImageMask),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      this.logger.debug('Respuesta de open ai...', resp);
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
        this.logger.error(error);
      }
      throw new InternalServerErrorException('Error al generar imagen');
    }
  }

  async imageGenerationByFileName(fileName: string) {
    this.logger.debug('Start get image by fileName=' + fileName);
    const imageFoler = path.resolve('./', './generated/images');
    const imageFile = path.resolve(__dirname, `${imageFoler}/${fileName}`);
    this.logger.debug('Path full image: ' + imageFile);

    if (!fs.existsSync(imageFile)) {
      throw new NotFoundException('Recurso no encontrodo');
    }

    return { imageFile };
  }
}
