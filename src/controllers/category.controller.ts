import { Request, Response, NextFunction } from 'express';
import { categoryService } from "../services/category.service";
import { sendSuccess } from "../utils/response.utils";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

export class CategoryController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAll();
      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getById(req.params.id);
      sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getBySlug(req.params.slug);
      sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCategorySchema.parse(req.body);
      const category = await categoryService.create(data);
      sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCategorySchema.parse(req.body);
      const category = await categoryService.update(req.params.id, data);
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(req.params.id);
      sendSuccess(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();

