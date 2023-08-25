import { Injectable } from '@nestjs/common';
import { PublicationsRepository } from './publications.repository';
import { CreatePublicationsDTO } from 'src/Dtos/publications.dtos';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PublicationsService {
  constructor(private publiRepository: PublicationsRepository) {}

  createPublication(publication: CreatePublicationsDTO) {
    const media = this.publiRepository.getMediaById(publication.mediaId);
    const post = this.publiRepository.getPostById(publication.postId);
    if (!media || !post) {
      throw new NotFoundException('NOT FOUND');
    }
  }

  getPublications() {
    const publications = this.publiRepository.getPublications();
    if (publications) {
      return publications;
    } else {
      return [];
    }
  }

  getPublicationById(id: number) {
    const publication = this.publiRepository.getPublicationById(id);
    if (publication) {
      return publication;
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }

  updatePublication(publication: CreatePublicationsDTO, id: number) {
    const media = this.publiRepository.getMediaById(publication.mediaId);
    const post = this.publiRepository.getPostById(publication.postId);
    if (!media || !post) {
      throw new NotFoundException('NOT FOUND');
    } else {
      const update = this.publiRepository.updatePublication(id, publication);
      if (update) {
        return update;
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }

  deletePublication(id: number) {
    const del = this.publiRepository.deletePublication(id);
    if (del) {
      return del;
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }
}
