import { Response, NextFunction } from 'express';
import { orderService } from "../services/order.service";
import { sendSuccess, sendPaginated } from "../utils/response.utils";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
} from "../validators/order.validator";
import type { AuthRequest } from "../types";

export class OrderController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = orderQuerySchema.parse(req.query);
      const isAdmin = req.user!.role === 'ADMIN';
      const result = await orderService.getAll(req.user!.userId, query, isAdmin);
      sendPaginated(res, result, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      const order = await orderService.getById(
        req.params.id,
        req.user!.userId,
        isAdmin
      );
      sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createOrderSchema.parse(req.body);
      const order = await orderService.create(req.user!.userId, data);
      sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = updateOrderStatusSchema.parse(req.body);
      const order = await orderService.updateStatus(req.params.id, status);
      sendSuccess(res, order, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.cancel(req.params.id, req.user!.userId);
      sendSuccess(res, order, 'Order cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();

