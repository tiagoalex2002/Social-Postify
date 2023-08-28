import { PublicationsRepository } from '../Publications/publications.repository';
import { MediaController } from './media.controller';
import { MediaRepository } from './media.repository';
import { MediaService } from './media.service';
import { PrismaService } from '../Prisma/prisma.service';
import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../Prisma/prisma.module';
import { PublicationsModule } from '../Publications/publication.module';

@Module({
  imports: [forwardRef(() => PublicationsModule), PrismaModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaRepository,
    PublicationsRepository,
    PrismaService,
  ],
  exports: [MediaService],
})
export class MediaModule {}
