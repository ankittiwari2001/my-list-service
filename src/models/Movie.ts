// models/Movie.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Genre } from './User';

export interface IMovie extends Document {
  title: string;
  description: string;
  genres: Genre[];
  releaseDate: Date;
  director: string;
  actors: string[];
}

const MovieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String }],
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  actors: [{ type: String }],
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
