import { response } from 'express';
import type { Review } from '../generated/prisma/client';
import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
   async summerizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);

      const joinedReview = reviews.map((r) => r.content).join('\n\n');

      //LLM prompt to summarize reviews
      const prompt = `Summarize the following reviews for product in to short paragraph highlightinh key
                     themes,both positive and negative aspects:
                     \n\nReviews for product ${productId}:\n\n${joinedReview}`;

      const response = await llmClient.generateText({
         prompt,
      });
      return response.text;
   },
};
