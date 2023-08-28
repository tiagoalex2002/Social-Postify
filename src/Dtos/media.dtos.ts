import { IsString } from 'class-validator';

export class CreateMediaDTO {
  @IsString()
  title: string;

  @IsString()
  username: string;
}
