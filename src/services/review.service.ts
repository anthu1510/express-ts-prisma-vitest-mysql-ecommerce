import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";
import type { CreateReviewInput, UpdateReviewInput } from "../validators/review.validator";

export class ReviewService {
  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      reviews,
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async create(userId: string, data: CreateReviewInput) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this product', 400);
    }

    return prisma.review.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async update(userId: string, reviewId: string, data: UpdateReviewInput) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    return prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async delete(userId: string, reviewId: string, isAdmin = false) {
    const where: { id: string; userId?: string } = { id: reviewId };

    if (!isAdmin) {
      where.userId = userId;
    }

    const review = await prisma.review.findFirst({ where });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
  }
}

export const reviewService = new ReviewService();

