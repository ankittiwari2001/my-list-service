// models/TVShow.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Genre } from './User';

interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  releaseDate: Date;
  director: string;
  actors: string[];
}

export interface ITVShow extends Document {
  title: string;
  description: string;
  genres: Genre[];
  episodes: Episode[];
}

const TVShowSchema = new Schema<ITVShow>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String }],
  episodes: [
    {
      episodeNumber: { type: Number, required: true },
      seasonNumber: { type: Number, required: true },
      releaseDate: { type: Date, required: true },
      director: { type: String, required: true },
      actors: [{ type: String }],
    },
  ],
});

export default mongoose.model<ITVShow>('TVShow', TVShowSchema);
