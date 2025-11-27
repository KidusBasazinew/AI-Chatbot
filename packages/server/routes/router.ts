import express, { type Request, type Response } from 'express';
import { reviewController } from '../controllers/review.controller';

const router = express.Router();

router.get('/products/:id/reviews', reviewController.getReviews);
router.post(
   '/products/:id/reviews/summarize',
   reviewController.summerizeReviews
);

export default router;
