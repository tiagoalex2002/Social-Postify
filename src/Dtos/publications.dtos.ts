import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CreatePublicationsDTO {
  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsDateString()
  date?: Date;
}
