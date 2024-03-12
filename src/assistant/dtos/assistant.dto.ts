import { IsNotEmpty, IsString } from 'class-validator';

export class AssistantDto {
  @IsNotEmpty()
  @IsString()
  threadId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
