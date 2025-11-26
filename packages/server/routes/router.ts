import express, { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma';
import { reviewController } from '../controllers/review.controller';

const router = express.Router();

router.get('/products/:id/reviews', reviewController.getReviews);

export default router;
