// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

interface WatchHistoryEntry {
  contentId: string;
  watchedOn: Date;
  rating?: number;
}

export interface IUser extends Document {
  username: string;
  preferences: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };
  watchHistory: WatchHistoryEntry[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  preferences: {
    favoriteGenres: [{ type: String }],
    dislikedGenres: [{ type: String }],
  },
  watchHistory: [
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: Number,
    },
  ],
});

export default mongoose.model<IUser>('User', UserSchema);
