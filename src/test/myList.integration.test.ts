import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Movie from '../models/Movie';
import TVShow from '../models/TVShow';
import MyListItem from '../models/MyListItem';

const userId = new mongoose.Types.ObjectId().toString(); // generate a new userId for each test run

beforeEach(async () => {
  // Clear collections before each test for isolation
  await Promise.all([
    Movie.deleteMany({}),
    TVShow.deleteMany({}),
    MyListItem.deleteMany({}),
  ]);
});

describe('My List API', () => {
  it('should add a movie to My List', async () => {
    const movie = await Movie.create({
      title: 'Avengers',
      description: 'Superhero team-up movie',
      genres: ['Action'],
      releaseDate: new Date(),
      director: 'Russo Brothers',
      actors: ['Robert Downey Jr.'],
    });

    const res = await request(app)
      .post('/my-list')
      .send({
        userId,
        contentId: movie._id,
        contentType: 'movie',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Added to My List');
  });

  it('should not add a duplicate item', async () => {
    const movie = await Movie.create({
      title: 'Inception',
      description: 'Dream layers',
      genres: ['SciFi'],
      releaseDate: new Date(),
      director: 'Christopher Nolan',
      actors: ['Leonardo DiCaprio'],
    });

    await request(app)
      .post('/my-list')
      .send({ userId, contentId: movie._id, contentType: 'movie' });

    const res = await request(app)
      .post('/my-list')
      .send({ userId, contentId: movie._id, contentType: 'movie' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Item already in list.');
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/my-list').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/userId, contentId, and contentType are required/);
  });

  it('should return 400 for invalid contentId', async () => {
    const res = await request(app).post('/my-list').send({
      userId,
      contentId: 'invalid-id',
      contentType: 'movie',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid contentId format.');
  });

  it('should return 404 if content not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).post('/my-list').send({
      userId,
      contentId: fakeId,
      contentType: 'movie',
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Content not found.');
  });

  it('should remove an item from My List', async () => {
    const movie = await Movie.create({
      title: 'Thor',
      description: 'Asgard',
      genres: ['Fantasy'],
      releaseDate: new Date(),
      director: 'Kenneth Branagh',
      actors: ['Chris Hemsworth'],
    });

    await request(app)
      .post('/my-list')
      .send({ userId, contentId: movie._id, contentType: 'movie' });

    const res = await request(app)
      .delete('/my-list')
      .send({ userId, contentId: movie._id });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Removed from My List');
  });

  it('should return 404 if item to remove is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete('/my-list')
      .send({ userId, contentId: fakeId });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Item not found in list.');
  });

  it('should list all My List items with content details', async () => {
    const movie = await Movie.create({
      title: 'Dangal',
      description: 'Wrestling',
      genres: ['Drama'],
      releaseDate: new Date(),
      director: 'Nitesh Tiwari',
      actors: ['Aamir Khan'],
    });

    const tvshow = await TVShow.create({
      title: 'Loki',
      description: 'Time travel',
      genres: ['SciFi'],
      episodes: [{
        episodeNumber: 1,
        seasonNumber: 1,
        releaseDate: new Date(),
        director: 'Kate Herron',
        actors: ['Tom Hiddleston'],
      }]
    });

    await request(app).post('/my-list').send({ userId, contentId: movie._id, contentType: 'movie' });
    await request(app).post('/my-list').send({ userId, contentId: tvshow._id, contentType: 'tvshow' });

    const res = await request(app).get(`/my-list?userId=${userId}&page=1&limit=10`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.items[0]).toHaveProperty('content');
  });
});
