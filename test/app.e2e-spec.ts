import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/Prisma/prisma.module';
import { PrismaService } from '../src/Prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.resolve(PrismaService); //ou o get
    await prisma.media.deleteMany();
    await prisma.posts.deleteMany();
    await prisma.publications.deleteMany();
    await app.init();
  });

  it('GET /health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect("I'm okay!");
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
    console.log(response.body);
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
  });

  it('GET /medias/3 => should return NOT FOUND', async () => {
    await prisma.media.deleteMany();
    const response = await request(app.getHttpServer()).get('/medias/3');
    console.log(response.body);
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
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
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

  it('POST /posts => should return BAD REQUEST when there are empty fields', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('GET /posts => should return the posts', async () => {
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer()).get('/posts');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('GET /posts/:id => should return the posts', async () => {
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should not have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer()).get('/posts/2');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('GET /posts/:id => should return NOT FOUND', async () => {
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should not have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer()).get('/posts/3');
    expect(response.statusCode).toBe(404);
  });

  it('PUT /posts/:id => should return NOT FOUND', async () => {
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await request(app.getHttpServer())
      .put('/posts/2')
      .send({
        title: 'Why you should not have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('PUT /posts/:id => should update successfully', async () => {
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await request(app.getHttpServer())
      .put('/posts/1')
      .send({
        title: 'Why you should not have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
      })
      .expect(HttpStatus.OK);
  });

  it('DELETE /posts/:id => should delete post', async () => {
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer()).delete('/posts/1');
    expect(response.statusCode).toBe(HttpStatus.OK);
  });

  it('DELETE /posts/:id => should return NOT FOUND', async () => {
    const response = await request(app.getHttpServer()).delete('/posts/1');
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('DELETE /posts/:id => should return FORBIDDEN', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await prisma.publications.create({
      data: {
        mediaId: 1,
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      },
    });
    const response = await request(app.getHttpServer()).delete('/posts/1');
    expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
  });

  it('POST /publications => should return NOT FOUND', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      });
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('POST /publications => should return BAD REQUEST', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer())
      .post('/publications')
      .send({
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      });
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('GET /publications => should return the publications', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      });
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(1);
  });

  it('GET /publications/:id => should return the specific publications', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await prisma.publications.create({
      data: {
        mediaId: 1,
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      },
    });
    const response = await request(app.getHttpServer()).get('/publications/1');
    expect(response.statusCode).toBe(HttpStatus.OK);
  });

  it('GET /publications/:id => should return NOT FOUND', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer()).get('/publications/1');
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('PUT /publications/:id => should return NOT FOUND when there is no available registration', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    const response = await request(app.getHttpServer())
      .put('/publications/1')
      .send({ id: 1, mediaId: 1, postId: 1, date: '2023-09-21T13:25:17.352Z' });
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('DELETE /publications/:id => should return NOT FOUND', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/publications/1',
    );
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('DELETE /publications/:id => should delete publication ', async () => {
    await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myusername',
      },
    });
    await prisma.posts.create({
      data: {
        title: 'Why you should have a guinea pig?',
        text: 'https://www.guineapigs.com/why-you-should-guinea',
        image: '',
      },
    });
    await prisma.publications.create({
      data: {
        mediaId: 1,
        postId: 1,
        date: '2023-08-21T13:25:17.352Z',
      },
    });
    const response = await request(app.getHttpServer()).delete(
      '/publications/1',
    );
    expect(response.statusCode).toBe(HttpStatus.OK);
  });
});
