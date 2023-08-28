import { CreatePostsDTO } from 'src/Dtos/posts.dtos';
import { PrismaService } from '../Prisma/prisma.service';
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

  async getPublicationByPostId(id: number) {
    return await this.prisma.publications.findFirst({ where: { postId: id } });
  }

  async updatePost(id: number, post: CreatePostsDTO) {
    return await this.prisma.posts.upsert({
      where: {
        id,
      },
      create: {
        title: post.title,
        text: post.text,
        image: post.image,
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
