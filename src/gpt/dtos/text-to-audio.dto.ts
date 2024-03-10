import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class TextToAudioDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  prompt: string;

  @IsOptional()
  @IsString()
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}

export class FileIdDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(13)
  fileId: string;
}
