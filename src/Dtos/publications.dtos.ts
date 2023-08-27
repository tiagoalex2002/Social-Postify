import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreatePublicationsDTO {
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsDate()
  date?: Date;
}
