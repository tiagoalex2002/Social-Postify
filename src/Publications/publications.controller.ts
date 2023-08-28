import {
  Body,
  Param,
  Controller,
  Get,
  Put,
  Delete,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationsDTO } from '../Dtos/publications.dtos';
import { HttpException } from '@nestjs/common';

@Controller('publications')
export class PublicationsController {
  constructor(private publiService: PublicationsService) {}

  @Post()
  createPost(@Body() body: CreatePublicationsDTO) {
    try {
      return this.publiService.createPublication(body);
    } catch (error) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  getPublications() {
    return this.publiService.getPublications();
  }

  @Get('/:id')
  getPublicationById(@Param('id') id: string) {
    try {
      return this.publiService.getPublicationById(Number(id));
    } catch (error) {
      if (error.message === 'NOT FOUND') {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Put('/:id')
  updatePublication(
    @Param('id') id: string,
    @Body() body: CreatePublicationsDTO,
  ) {
    try {
      return this.publiService.updatePublication(body, Number(id));
    } catch (error) {
      if (error.message === 'NOT FOUND') {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'FORBIDDEN') {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
    }
  }

  @Delete('/:id')
  deletePublication(@Param('id') id: string) {
    try {
      return this.publiService.deletePublication(Number(id));
    } catch (error) {
      if (error.message === 'NOT FOUND') {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
    }
  }
}
