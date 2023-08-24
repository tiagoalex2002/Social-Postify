import { IsString, IsUrl } from 'class-validator';

export class CreateMediaDTO {
  @IsString()
  title: string;

  @IsString()
  @IsUrl()
  username: string;
}
