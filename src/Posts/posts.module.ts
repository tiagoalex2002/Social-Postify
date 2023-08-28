import { PublicationsRepository } from '../Publications/publications.repository';
import { PostsController } from './posts.controller';
import { PostRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PrismaService } from '../Prisma/prisma.service';
import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../Prisma/prisma.module';
import { PublicationsModule } from '../Publications/publication.module';

@Module({
  imports: [forwardRef(() => PublicationsModule), PrismaModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostRepository,
    PublicationsRepository,
    PrismaService,
  ],
  exports: [PostsService],
})
export class PostsModule {}
