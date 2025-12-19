import { Response, NextFunction } from "express";
import { cartService } from "../services/cart.service";
import { sendSuccess } from "../utils/response.utils";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validators/cart.validator";
import type { AuthRequest } from "../types";

export class CartController {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      sendSuccess(res, cart, "Cart retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = addToCartSchema.parse(req.body);
      const cart = await cartService.addItem(req.user!.userId, data);
      sendSuccess(res, cart, "Item added to cart successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateCartItemSchema.parse(req.body);
      const cart = await cartService.updateItem(
        req.user!.userId,
        req.params.itemId,
        data
      );
      sendSuccess(res, cart, "Cart item updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.removeItem(
        req.user!.userId,
        req.params.itemId
      );
      sendSuccess(res, cart, "Item removed from cart successfully");
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.clearCart(req.user!.userId);
      sendSuccess(res, cart, "Cart cleared successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
