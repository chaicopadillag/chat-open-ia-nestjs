import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AudioToTextType } from '../core/types/audio-to-text.type';
import {
  AudioToTextDto,
  FileIdDto,
  ImageGerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslationDto,
} from './dtos';
import { GptService } from './gpt.service';
import { createMulterOptions } from './interceptors/audio-file-interceptor';
import { AudioFilePipe } from './pipes/audio-file.pipe';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-stream')
  async prosConsStream(
    @Body() prosConsDicusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsStream(prosConsDicusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('pros-cons-discusser')
  async prosConsDiscusser(@Body() prosConsDicusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDicusserDto);
  }

  @Post('translate')
  async translate(@Body() dtoTranslate: TranslationDto) {
    return this.gptService.translate(dtoTranslate);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const { audioFile } = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(audioFile);
  }

  @Get('text-to-audio/:fileId')
  async getAudioFile(@Param() fileIdDto: FileIdDto, @Res() res: Response) {
    const { audioFile } = await this.gptService.getAudioFile(fileIdDto.fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(audioFile);
  }

  @Post('audio-to-text')
  @UseInterceptors(FileInterceptor('file', createMulterOptions))
  async audioToText(
    @UploadedFile(AudioFilePipe)
    file: Express.Multer.File,
    @Body() audioToText: AudioToTextDto,
  ) {
    let body: AudioToTextType = { file };

    if (audioToText?.prompt) {
      body = { ...body, prompt: audioToText.prompt };
    }
    return this.gptService.audioToText(body);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGerationDto) {
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileId')
  async imageGenerationByFileName(
    @Param() fileIdDto: FileIdDto,
    @Res() res: Response,
  ) {
    const { imageFile } = await this.gptService.imageGenerationByFileName(
      fileIdDto.fileId,
    );
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(imageFile);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.gptService.imageVariation(imageVariationDto);
  }
}
