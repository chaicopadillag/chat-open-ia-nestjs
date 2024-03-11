import { IsNotEmpty, IsString } from 'class-validator';

export class ImageVariationDto {
  @IsNotEmpty()
  @IsString()
  image: string;
}
