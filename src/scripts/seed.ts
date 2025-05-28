// src/scripts/seed.ts
import mongoose from 'mongoose';
import User from '../models/User';
import Movie from '../models/Movie';
import TVShow from '../models/TVShow';

export const seedTestData = async () => {
  await User.deleteMany({});
  await Movie.deleteMany({});
  await TVShow.deleteMany({});

  const users = await User.insertMany([
    {
      username: 'ankittiwari2001',
      preferences: {
        favoriteGenres: ['Action', 'Comedy'],
        dislikedGenres: ['Horror'],
      },
      watchHistory: [],
    },
    {
      username: 'anki_0711',
      preferences: {
        favoriteGenres: ['Drama', 'SciFi'],
        dislikedGenres: ['Romance'],
      },
      watchHistory: [],
    },
  ]);

  const movies = await Movie.insertMany([
    {
      title: 'Avengers: Endgame',
      description: 'Superheroes unite to defeat Thanos.',
      genres: ['Action', 'SciFi'],
      releaseDate: new Date('2019-04-26'),
      director: 'Anthony and Joe Russo',
      actors: ['Robert Downey Jr.', 'Chris Evans'],
    },
    {
      title: 'Hera Pheri',
      description: 'Three unemployed men find the answer to all their money problems.',
      genres: ['Comedy'],
      releaseDate: new Date('2000-03-31'),
      director: 'Priyadarshan',
      actors: ['Akshay Kumar', 'Paresh Rawal'],
    },
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing.',
      genres: ['Action', 'SciFi'],
      releaseDate: new Date('2010-07-16'),
      director: 'Christopher Nolan',
      actors: ['Leonardo DiCaprio'],
    },
    {
      title: 'Titanic',
      description: 'A romance blossoms on the ill-fated RMS Titanic.',
      genres: ['Romance', 'Drama'],
      releaseDate: new Date('1997-12-19'),
      director: 'James Cameron',
      actors: ['Leonardo DiCaprio', 'Kate Winslet'],
    },
    {
      title: 'The Conjuring',
      description: 'Paranormal investigators help a family terrorized by a dark presence.',
      genres: ['Horror'],
      releaseDate: new Date('2013-07-19'),
      director: 'James Wan',
      actors: ['Vera Farmiga', 'Patrick Wilson'],
    },
    {
      title: '3 Idiots',
      description: 'Three engineering students navigate college and life.',
      genres: ['Comedy', 'Drama'],
      releaseDate: new Date('2009-12-25'),
      director: 'Rajkumar Hirani',
      actors: ['Aamir Khan', 'R. Madhavan'],
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space.',
      genres: ['SciFi', 'Drama'],
      releaseDate: new Date('2014-11-07'),
      director: 'Christopher Nolan',
      actors: ['Matthew McConaughey', 'Anne Hathaway'],
    },
    {
      title: 'Dangal',
      description: 'Father trains his daughters to become wrestlers.',
      genres: ['Drama'],
      releaseDate: new Date('2016-12-21'),
      director: 'Nitesh Tiwari',
      actors: ['Aamir Khan'],
    },
    {
      title: 'The Matrix',
      description: 'A hacker discovers reality is a simulation.',
      genres: ['Action', 'SciFi'],
      releaseDate: new Date('1999-03-31'),
      director: 'The Wachowskis',
      actors: ['Keanu Reeves'],
    },
    {
      title: 'PK',
      description: 'An alien questions religious dogmas on Earth.',
      genres: ['Comedy', 'Drama'],
      releaseDate: new Date('2014-12-19'),
      director: 'Rajkumar Hirani',
      actors: ['Aamir Khan'],
    },
  ]);

  const tvShows = await TVShow.insertMany([
    {
      title: 'Loki',
      description: 'The God of Mischief steps out of his brother’s shadow.',
      genres: ['SciFi', 'Fantasy'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2021-06-09'),
          director: 'Kate Herron',
          actors: ['Tom Hiddleston'],
        },
      ],
    },
    {
      title: 'Breaking Bad',
      description: 'A chemistry teacher turns to making meth.',
      genres: ['Drama'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2008-01-20'),
          director: 'Vince Gilligan',
          actors: ['Bryan Cranston'],
        },
      ],
    },
    {
      title: 'Stranger Things',
      description: 'Kids uncover a mystery in their small town.',
      genres: ['SciFi', 'Horror'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2016-07-15'),
          director: 'The Duffer Brothers',
          actors: ['Millie Bobby Brown'],
        },
      ],
    },
    {
      title: 'Friends',
      description: 'Follows the lives of six reckless adults in Manhattan.',
      genres: ['Comedy', 'Romance'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('1994-09-22'),
          director: 'James Burrows',
          actors: ['Jennifer Aniston'],
        },
      ],
    },
    {
      title: 'Sacred Games',
      description: 'A troubled cop uncovers a web of crime.',
      genres: ['Drama', 'Action'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date('2018-07-06'),
          director: 'Anurag Kashyap',
          actors: ['Nawazuddin Siddiqui'],
        },
      ],
    },
  ]);
};

// Allow direct CLI run
if (require.main === module) {
  (async () => {
    const MONGO_URI = 'mongodb://localhost:27017/mylist';
    await mongoose.connect(MONGO_URI);
    await seedTestData();
    console.log('Seed complete.');
    await mongoose.disconnect();
  })().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
