import { Injectable } from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { CreateMediaDTO } from 'src/Dtos/media.dtos';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class MediaService {
  constructor(private mediaRepository: MediaRepository) {}

  getMedias() {
    const medias = this.mediaRepository.getMedias();
    if (!medias) {
      return [];
    } else {
      return medias;
    }
  }

  async getMediaById(id: number) {
    const media = await this.mediaRepository.getMediaById(id);
    console.log(media);
    if (media) {
      return media;
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }

  async createMedia(media: CreateMediaDTO) {
    const medias = await this.mediaRepository.getMedias();
    if (medias) {
      for (let i = 0; i < medias.length; i++) {
        if (
          media.title === medias[i].title &&
          media.username === medias[i].username
        ) {
          throw new ConflictException('CONFLICT');
        }
      }
    } else {
      return this.mediaRepository.createMedia(media);
    }
  }

  async updateMedia(media: CreateMediaDTO, id: number) {
    if (media.title === media.username) {
      throw new ConflictException('CONFLICT');
    } else {
      const exists = await this.mediaRepository.getMediaById(id);
      console.log(exists);
      if (exists) {
        return this.mediaRepository.updateMedia(media, id);
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }

  async deleteMedia(id: number) {
    const exists = await this.mediaRepository.getPublicationByMediaId(id);
    if (exists) {
      throw new ForbiddenException('FORBIDDEN');
    } else {
      const media = await this.mediaRepository.getMediaById(id);
      if (media) {
        return this.mediaRepository.deleteMedia(id);
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }
}
