import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { PrismaService } from '../Prisma/prisma.service';
import { MediaModule } from '../Media/media.module';
import { PostsModule } from '../Posts/posts.module';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository, PrismaService],
  imports: [forwardRef(() => MediaModule), forwardRef(() => PostsModule)],
  exports: [PublicationsRepository],
})
export class PublicationsModule {}
