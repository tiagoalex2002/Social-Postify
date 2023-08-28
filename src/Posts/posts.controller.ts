import { PostsService } from './posts.service';
import { CreatePostsDTO } from '../Dtos/posts.dtos';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Controller,
} from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('/posts')
  createPost(@Body() body: CreatePostsDTO) {
    try {
      return this.postsService.createPost(body);
    } catch (error) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/posts')
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('/posts/:id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Put('/posts/:id')
  updatePost(@Param('id') id: string, @Body() body: CreatePostsDTO) {
    try {
      return this.postsService.updatePost(body, Number(id));
    } catch (error) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('/posts/:id')
  deleteMedia(@Param('id') id: string) {
    try {
      return this.postsService.deletePost(Number(id));
    } catch (error) {
      if (error.message === 'NOT FOUND') {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'FORBIDDEN') {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
    }
  }
}
