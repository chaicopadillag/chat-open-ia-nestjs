import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TranslationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  prompt: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lang: string;
}
