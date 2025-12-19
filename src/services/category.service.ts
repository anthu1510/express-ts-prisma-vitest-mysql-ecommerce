import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/slug.utils";
import { AppError } from "../middleware/error.middleware";
import type { CreateCategoryInput, UpdateCategoryInput } from "../validators/category.validator";

export class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async create(data: CreateCategoryInput) {
    const slug = generateSlug(data.name);

    return prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const updateData: UpdateCategoryInput & { slug?: string } = { ...data };

    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (category._count.products > 0) {
      throw new AppError('Cannot delete category with products', 400);
    }

    await prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();

