import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MediaModule } from './Media/media.module';
import { PostsModule } from './Posts/posts.module';
import { PublicationsModule } from './Publications/publication.module';
import { PrismaModule } from './Prisma/prisma.module';
import { AppService } from './app.service';

@Module({
  imports: [MediaModule, PostsModule, PublicationsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
