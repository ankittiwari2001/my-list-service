// models/MyListItem.ts
import mongoose, { Schema, Document } from 'mongoose';

export type ContentType = 'movie' | 'tvshow';

export interface IMyListItem extends Document {
  userId: string;
  contentId: string;
  contentType: ContentType;
  addedAt: Date;
}

const MyListItemSchema = new Schema<IMyListItem>({
  userId: { type: String, required: true, index: true },
  contentId: { type: String, required: true },
  contentType: {
    type: String,
    enum: ['movie', 'tvshow'],
    required: true,
  },
  addedAt: { type: Date, default: Date.now },
});

// Unique compound index to prevent duplicates
MyListItemSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model<IMyListItem>('MyListItem', MyListItemSchema);
