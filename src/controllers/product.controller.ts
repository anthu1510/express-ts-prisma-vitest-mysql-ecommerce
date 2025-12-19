import { Request, Response, NextFunction } from 'express';
import { productService } from "../services/product.service";
import { sendSuccess, sendPaginated } from "../utils/response.utils";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validators/product.validator";

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = productQuerySchema.parse(req.query);
      const result = await productService.getAll(query);
      sendPaginated(res, result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.create(data);
      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.update(req.params.id, data);
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id);
      sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();

