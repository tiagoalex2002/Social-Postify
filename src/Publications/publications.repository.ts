import { PrismaService } from 'src/Prisma/prisma.service';
import { CreatePublicationsDTO } from 'src/Dtos/publications.dtos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicationsRepository {
  constructor(private prisma: PrismaService) {}

  async createPublication(publication: CreatePublicationsDTO) {
    return await this.prisma.publications.create({ data: publication });
  }

  async getPublications() {
    return await this.prisma.publications.findMany();
  }

  async getPublicationById(id: number) {
    return await this.prisma.publications.findUnique({ where: { id } });
  }

  async getPostById(id: number) {
    return await this.prisma.posts.findUnique({ where: { id } });
  }

  async getPublicationByMediaId(id: number) {
    return await this.prisma.publications.findFirs({ where: { mediaId: id } });
  }

  async updatePublication(id: number, publication: CreatePublicationsDTO) {
    return await this.prisma.publications.upsert({
      where: {
        id,
      },
      update: {
        data: { publication },
      },
    });
  }

  async getMediaById(id: number) {
    return await this.prisma.media.findUnique({ where: { id } });
  }

  async deletePublication(id: number) {
    return await this.prisma.publications.delete({ where: { id } });
  }
}
