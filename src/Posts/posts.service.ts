import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { CreatePostsDTO } from 'src/Dtos/posts.dtos';
import { NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostRepository) {}

  createPost(post: CreatePostsDTO) {
    return this.postRepository.createPost(post);
  }

  getPosts() {
    const posts = this.postRepository.getPosts();
    if (posts) {
      return posts;
    } else {
      return [];
    }
  }

  async getPostById(id: number) {
    const media = await this.postRepository.getPostById(id);
    if (!media) {
      throw new NotFoundException('NOT FOUND');
    } else {
      return media;
    }
  }

  async updatePost(post: CreatePostsDTO, id: number) {
    const exists = await this.postRepository.getPostById(id);
    if (exists) {
      return this.postRepository.updatePost(id, post);
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }

  async deletePost(id: number) {
    const exists = await this.postRepository.getPublicationByPostId(id);
    if (exists) {
      throw new ForbiddenException('FORBIDDEN');
    } else {
      const post = await this.postRepository.getPostById(id);
      if (post) {
        return this.postRepository.deletePost(id);
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }
}
