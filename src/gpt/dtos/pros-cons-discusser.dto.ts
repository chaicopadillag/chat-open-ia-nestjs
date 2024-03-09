import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ProsConsDiscusserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  prompt: string;
}
