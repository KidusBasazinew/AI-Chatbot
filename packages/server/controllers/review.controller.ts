import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { reviewService } from '../services/review.service';

export const reviewController = {
   getReviews: async (req: Request, res: Response) => {
      try {
         const productId = Number(req.params.id);

         if (!productId || isNaN(productId)) {
            res.status(400).json({ error: 'Invalid product id' });
         }

         const review = await reviewService.getReviews(productId);

         return res.status(200).json({ review: review });
      } catch (e) {
         console.log('Error fetching reviews:', e);
         res.status(500).json({ message: 'Internal server error' });
      }
   },

   summerizeReviews: async (req: Request, res: Response) => {
      try {
         const productId = Number(req.params.id);

         if (!productId || isNaN(productId)) {
            res.status(400).json({ error: 'Invalid product id' });
         }

         const summary = await reviewService.summerizeReviews(productId);

         return res.status(200).json({ summary: summary });
      } catch (e) {
         console.log('Error fetching reviews:', e);
         res.status(500).json({ message: 'Internal server error' });
      }
   },
};
