import { IsOptional, IsString, MinLength } from 'class-validator';

export class AudioToTextDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  prompt?: string;
}
