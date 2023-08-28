import { Injectable } from '@nestjs/common';
import { CreateMediaDTO } from 'src/Dtos/media.dtos';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class MediaRepository {
  constructor(private prisma: PrismaService) {}

  async getMedias(): Promise<any[]> {
    return await this.prisma.media.findMany();
  }

  async getMediaById(id: number) {
    return await this.prisma.media.findUnique({ where: { id } });
  }

  async updateMedia(media: CreateMediaDTO, id: number) {
    return this.prisma.media.upsert({
      where: {
        id,
      },
      create: {
        title: media.title,
        username: media.username,
      },
      update: {
        username: media.username,
      },
    });
  }

  async createMedia(media: CreateMediaDTO) {
    return await this.prisma.media.create({
      data: media,
    });
  }

  async getPublicationByMediaId(id: number) {
    return await this.prisma.publications.findFirst({ where: { mediaId: id } });
  }

  async deleteMedia(id: number) {
    return await this.prisma.media.delete({ where: { id } });
  }
}
