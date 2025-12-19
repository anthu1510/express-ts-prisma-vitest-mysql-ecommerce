import { Prisma } from '@prisma/client';
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/slug.utils";
import { AppError } from "../middleware/error.middleware";
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "../validators/product.validator";
import type { PaginatedResponse } from "../types";

export class ProductService {
  async getAll(query: ProductQueryInput): Promise<PaginatedResponse<Prisma.ProductGetPayload<{ include: { category: true } }>>> {
    const { page, limit, search, categoryId, minPrice, maxPrice, sortBy, sortOrder, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
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

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async create(data: CreateProductInput) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const slug = generateSlug(data.name);

    return prisma.product.create({
      data: {
        ...data,
        slug,
      },
      include: { category: true },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    const updateData: UpdateProductInput & { slug?: string } = { ...data };

    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await prisma.product.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();

