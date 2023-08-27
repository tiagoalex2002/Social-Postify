import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PrismaModule } from 'src/Prisma/prisma.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = await moduleFixture.resolve(PrismaService); //ou o get
    await prisma.ENTIDADE.deleteMany();
    await app.init();
  });

  it('GET /health', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /medias', async () => {
    //setup
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    const response = await request(app.getHttpServer()).get('/medias');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('POST /medias => should respond with a conflict', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
        username: 'myusername',
      })
      .expect(HttpStatus.CONFLICT);
  });

  it('POST /medias => should create a media', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
        username: 'myusername',
      })
      .expect(HttpStatus.CREATED);
  });

  it('GET /medias/1 => should return the specific media', async () => {
    //setup
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    const response = await request(app.getHttpServer()).get('/medias/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('GET /medias/3 => should return NOT FOUND', async () => {
    const response = await request(app.getHttpServer()).get('/medias/3');
    expect(response.statusCode).toBe(404);
  });

  it('PUT /medias/1 => should update successfully ', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });

    await request(app.getHttpServer())
      .put('/medias/1')
      .send({
        title: 'Instagram',
        username: 'myusername-2',
      })
      .expect(HttpStatus.OK);
  });

  it('PUT /medias/1 => should return NOT FOUND when media does not exists', async () => {
    await request(app.getHttpServer())
      .put('/medias/1')
      .send({
        title: 'Instagram',
        username: 'myusername-2',
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('DELETE /medias/1 => should delete media', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    const response = await request(app.getHttpServer()).delete('/medias/1');
    expect(response.statusCode).toBe(HttpStatus.OK);
  });

  it('DELETE /medias/1 => should return NOT FOUND', async () => {
    const response = await request(app.getHttpServer()).delete('/medias/1');
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('DELETE /medias/1 => should return FORBIDDEN', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.post.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
      },
    });
    await prisma.publications.create({
      data: {
        mediaId: 1,
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      },
    });
    const response = await request(app.getHttpServer()).delete('/medias/1');
    expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
  });
});
