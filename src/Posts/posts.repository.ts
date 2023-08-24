import { CreatePostsDTO } from 'src/Dtos/posts.dtos';
import { PrismaService } from 'src/Prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async createPost(post: CreatePostsDTO) {
    return await this.prisma.posts.create({ data: post });
  }

  async getPosts() {
    return await this.prisma.posts.findMany();
  }

  async getPostById(id: number) {
    return await this.prisma.posts.findUnique({ where: { id } });
  }

  async updatePost(id: number, post: CreatePostsDTO) {
    return await this.prisma.posts.upsert({
      where: {
        id,
      },
      update: {
        text: post.text,
      },
    });
  }

  async deletePost(id: number) {
    return await this.prisma.posts.delete({ where: { id } });
  }
}
