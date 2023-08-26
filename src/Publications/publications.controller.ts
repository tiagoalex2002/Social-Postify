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
import { CreatePublicationsDTO } from 'src/Dtos/publications.dtos';
import { HttpException } from '@nestjs/common';

@Controller('publications')
export class PublicationsController {
  constructor(private publiService: PublicationsService) {}

  @Post('/publications')
  createPost(@Body() body: CreatePublicationsDTO) {
    try {
      return this.publiService.createPublication(body);
    } catch (error) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/publications')
  getPublications() {
    return this.publiService.getPublications();
  }

  @Get('/publications/:id')
  getPublicationById(@Param('id') id: string) {
    try {
      return this.publiService.getPublicationById(Number(id));
    } catch (error) {
      if (error.message === 'NOT FOUND') {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Put('/publications/:id')
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
    }
  }

  @Delete('/publications/:id')
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
