import { Request, Response, NextFunction } from 'express';
import { reviewService } from "../services/review.service";
import { sendSuccess } from "../utils/response.utils";
import { createReviewSchema, updateReviewSchema } from "../validators/review.validator";
import type { AuthRequest } from "../types";

export class ReviewController {
  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await reviewService.getProductReviews(
        req.params.productId,
        page,
        limit
      );
      sendSuccess(res, result, 'Reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createReviewSchema.parse(req.body);
      const review = await reviewService.create(req.user!.userId, data);
      sendSuccess(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateReviewSchema.parse(req.body);
      const review = await reviewService.update(
        req.user!.userId,
        req.params.id,
        data
      );
      sendSuccess(res, review, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      await reviewService.delete(req.user!.userId, req.params.id, isAdmin);
      sendSuccess(res, null, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();

