import { IsOptional, IsString, MinLength } from 'class-validator';

export class ImageGerationDto {
  @IsString()
  @MinLength(10)
  prompt: string;

  @IsOptional()
  @IsString()
  originalImage?: string;

  @IsOptional()
  @IsString()
  maskImage?: string;
}
