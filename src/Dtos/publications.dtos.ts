import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreatePostsDTO {
  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
