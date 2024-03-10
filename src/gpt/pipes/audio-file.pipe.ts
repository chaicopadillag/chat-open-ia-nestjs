import {
  HttpStatus,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class AudioFilePipe implements PipeTransform {
  async transform(audioFile: Express.Multer.File) {
    return new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1000 * 1024 * 5,
          message: 'El archivo pesa más de 5MB',
        }),
      ],
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }).transform(audioFile);
  }
}
