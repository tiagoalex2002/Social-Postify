import { Injectable } from '@nestjs/common';
import { CreateMediaDTO } from 'src/Dtos/media.dtos';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class MediaRepository {
  constructor(private prisma: PrismaService) {}

  async getMedias() {
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

  async deleteMedia(id: number) {
    return await this.prisma.media.delete({ where: { id } });
  }
}
