import { Request, Response } from 'express';
import mongoose from 'mongoose';
import MyListItem, { ContentType } from '../models/MyListItem';
import Movie from '../models/Movie';
import TVShow from '../models/TVShow';

interface AddToListBody {
  userId: string;
  contentId: string;
  contentType: ContentType;
}

export const addToList = async (req: Request, res: Response) => {
  try {
    const { userId, contentId, contentType } = req.body as AddToListBody;

    if (!userId || !contentId || !contentType) {
      return res.status(400).json({ message: 'userId, contentId, and contentType are required.' });
    }

    if (!['movie', 'tvshow'].includes(contentType)) {
      return res.status(400).json({ message: 'Invalid content type.' });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: 'Invalid contentId format.' });
    }

    const contentExists = contentType === 'movie'
      ? await Movie.findById(contentId)
      : await TVShow.findById(contentId);

    if (!contentExists) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    const item = await MyListItem.create({ userId, contentId, contentType });
    return res.status(201).json({ message: 'Added to My List', item });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Item already in list.' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromList = async (req: Request, res: Response) => {
  try {
    const { userId, contentId } = req.body;

    if (!userId || !contentId) {
      return res.status(400).json({ message: 'userId and contentId are required.' });
    }

    const deleted = await MyListItem.findOneAndDelete({ userId, contentId });

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found in list.' });
    }

    return res.status(200).json({ message: 'Removed from My List' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyList = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const skip = (page - 1) * limit;

    const listItems = await MyListItem.find({ userId })
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const movieIds = listItems.filter(i => i.contentType === 'movie').map(i => i.contentId.toString());
    const tvshowIds = listItems.filter(i => i.contentType === 'tvshow').map(i => i.contentId.toString());

    const [movies, tvshows] = await Promise.all([
      Movie.find({ _id: { $in: movieIds } }).lean(),
      TVShow.find({ _id: { $in: tvshowIds } }).lean()
    ]);

    const fullList = listItems.map(item => {
      const content = item.contentType === 'movie'
        ? movies.find(m => m._id.toString() === item.contentId.toString())
        : tvshows.find(t => t._id.toString() === item.contentId.toString());

      return {
        ...item,
        content,
      };
    });

    return res.status(200).json({ items: fullList });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
