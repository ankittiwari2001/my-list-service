import express from 'express';
import { addToList, removeFromList, getMyList } from '../controllers/my_list.controller';
import { RequestHandler } from 'express';

const router = express.Router();

function asyncHandler(fn: Function): express.RequestHandler {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

router.post('/', asyncHandler(addToList));
router.delete('/', asyncHandler(removeFromList));
router.get('/', asyncHandler(getMyList));

export default router;
