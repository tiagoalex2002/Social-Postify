import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostsController } from './Posts/posts.controller';
import { PublicationsController } from './Publications/publications.controller';
import { MediaController } from './Media/media.controller';
import { PostsService } from './Posts/posts.service';
import { MediaService } from './Media/media.service';
import { PublicationsService } from './Publications/publications.service';
import { PostRepository } from './Posts/posts.repository';
import { MediaRepository } from './Media/media.repository';
import { PublicationsRepository } from './Publications/publications.repository';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    PostsController,
    PublicationsController,
    MediaController,
  ],
  providers: [
    AppService,
    PostsService,
    MediaService,
    PublicationsService,
    PostRepository,
    MediaRepository,
    PublicationsRepository,
  ],
})
export class AppModule {}
