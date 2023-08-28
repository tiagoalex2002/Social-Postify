import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDTO } from '../Dtos/media.dtos';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Controller('medias')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post()
  createMedia(@Body() body: CreateMediaDTO) {
    try {
      return this.mediaService.createMedia(body);
    } catch (error) {
      throw new HttpException('CONFLICT', HttpStatus.CONFLICT);
    }
  }

  @Get()
  getMedias() {
    return this.mediaService.getMedias();
  }

  @Get('/:id')
  getMediaById(@Param('id') id: string) {
    return this.mediaService.getMediaById(Number(id));
  }

  @Put('/:id')
  updateMedia(@Param('id') id: string, @Body() body: CreateMediaDTO) {
    try {
      return this.mediaService.updateMedia(body, Number(id));
    } catch (error) {
      if (error.message === 'CONFLICT') {
        throw new HttpException('CONFLICT', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Delete('/:id')
  deleteMedia(@Param('id') id: string) {
    try {
      return this.mediaService.deleteMedia(Number(id));
    } catch (error) {
      if (error.message === 'NOT FOUND') {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
    }
  }
}
