import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  FileIdDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslationDto,
} from './dtos';
import { GptService } from './gpt.service';

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
}
