import { Injectable } from '@nestjs/common';
import { PublicationsRepository } from './publications.repository';
import { CreatePublicationsDTO } from 'src/Dtos/publications.dtos';
import { NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class PublicationsService {
  constructor(private publiRepository: PublicationsRepository) {}

  async createPublication(publication: CreatePublicationsDTO) {
    const media = await this.publiRepository.getMediaById(publication.mediaId);
    const post = await this.publiRepository.getPostById(publication.postId);
    if (!media || !post) {
      throw new NotFoundException('NOT FOUND');
    } else {
      return this.publiRepository.createPublication(publication);
    }
  }

  async getPublications() {
    const publications = await this.publiRepository.getPublications();
    if (publications) {
      return publications;
    } else {
      return [];
    }
  }

  async getPublicationById(id: number) {
    const publication = await this.publiRepository.getPublicationById(id);
    if (publication) {
      return publication;
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }

  async updatePublication(publication: CreatePublicationsDTO, id: number) {
    const media = await this.publiRepository.getMediaById(publication.mediaId);
    const post = await this.publiRepository.getPostById(publication.postId);
    if (!media || !post) {
      throw new NotFoundException('NOT FOUND');
    } else {
      const publication = await this.publiRepository.getPublicationById(id);
      if (publication) {
        const now = dayjs().toDate().getTime();
        const timestamp = dayjs(publication.date).toDate().getTime();
        if (now < timestamp) {
          return this.publiRepository.updatePublication(id, publication);
        } else {
          throw new ForbiddenException('FORBIDDEN');
        }
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }

  async deletePublication(id: number) {
    const publication = await this.publiRepository.getPublicationById(id);
    if (publication) {
      return this.publiRepository.deletePublication(id);
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }
}
