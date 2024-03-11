import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import * as sharp from 'sharp';

@Injectable()
export default class DownloadImageService {
  private logger = new Logger(DownloadImageService.name);
  private imageFolder: string;
  constructor(private readonly httpService: HttpService) {
    this.imageFolder = path.resolve('./', './generated/images');
  }

  async downloadImageAsPng(url: string) {
    try {
      const imageName = new Date().getTime() + '.png';

      fs.mkdirSync(this.imageFolder, { recursive: true });

      this.logger.debug('Iniciando descarga de la imagen: ' + url);

      const arrayBuffer = await lastValueFrom(
        this.httpService
          .get<Buffer>(url, {
            responseType: 'arraybuffer',
          })
          .pipe(
            map((resp) => resp.data),
            catchError(() =>
              throwError(
                () => new Error('Error al descargar imagen de openai'),
              ),
            ),
          ),
      );

      //   fs.writeFileSync(`${imageFolder}/${imageName}`, Buffer.from(arrayBuffer));
      const pathImage = `${this.imageFolder}/${imageName}`;

      await sharp(Buffer.from(arrayBuffer))
        .png()
        .ensureAlpha()
        .toFile(pathImage);

      return {
        pathImage,
        imageName,
      };
    } catch (error) {
      this.logger.error('Error: ', error);
    }
  }

  async downloadBase64ImageAsPng(base64Image: string) {
    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const imageName = `${new Date().getTime()}-64.png`;
    const pathImageMask = `${this.imageFolder}/${imageName}`;

    fs.mkdirSync(this.imageFolder, { recursive: true });

    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer).png().ensureAlpha().toFile(pathImageMask);

    return {
      pathImageMask,
      imageName,
    };
  }
}
