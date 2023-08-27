import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreatePublicationsDTO {
  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsDate()
  date?: Date;
}
