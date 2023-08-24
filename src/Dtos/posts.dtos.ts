import { IsString, IsUrl } from 'class-validator';

export class CreatePostsDTO {
  @IsString()
  title: string;

  @IsString()
  @IsUrl()
  text: string;
}
