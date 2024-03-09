import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  maxTokens?: number;
}
