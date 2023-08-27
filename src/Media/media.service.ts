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

  getMediaById(id: number) {
    const media = this.mediaRepository.getMediaById(id);
    if (!media) {
      throw new NotFoundException('NOT FOUND');
    } else {
      return media;
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

  updateMedia(media: CreateMediaDTO, id: number) {
    if (media.title === media.username) {
      throw new ConflictException('CONFLICT');
    } else {
      const midia = this.mediaRepository.getMediaById(id);
      if (midia) {
        return this.mediaRepository.updateMedia(media, id);
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }

  deleteMedia(id: number) {
    const exists = this.mediaRepository.getPublicationByMediaId(id);
    if (exists) {
      const del = this.mediaRepository.deleteMedia(id);
      if (del) {
        return del;
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    } else {
      throw new ForbiddenException('FORBIDDEN');
    }
  }
}
