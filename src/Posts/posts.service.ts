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

  getPostById(id: number) {
    const media = this.postRepository.getPostById(id);
    if (!media) {
      throw new NotFoundException('NOT FOUND');
    } else {
      return media;
    }
  }

  updatePost(post: CreatePostsDTO, id: number) {
    const update = this.postRepository.updatePost(id, post);
    if (update) {
      return update;
    } else {
      throw new NotFoundException('NOT FOUND');
    }
  }

  deletePost(id: number) {
    const exists = this.postRepository.getPublicationByPostId(id);
    if (exists) {
      throw new ForbiddenException('FORBIDDEN');
    } else {
      const post = this.postRepository.getPostById(id);
      if (post) {
        return this.postRepository.deletePost(id);
      } else {
        throw new NotFoundException('NOT FOUND');
      }
    }
  }
}
