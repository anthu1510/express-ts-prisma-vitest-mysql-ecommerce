import { Response, NextFunction } from 'express';
import { userService } from "../services/user.service";
import { sendSuccess } from "../utils/response.utils";
import { createAddressSchema, updateAddressSchema } from "../validators/address.validator";
import type { AuthRequest } from "../types";
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
});

export class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user!.userId);
      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateProfileSchema.parse(req.body);
      const user = await userService.updateProfile(req.user!.userId, data);
      sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await userService.getAddresses(req.user!.userId);
      sendSuccess(res, addresses, 'Addresses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createAddressSchema.parse(req.body);
      const address = await userService.createAddress(req.user!.userId, data);
      sendSuccess(res, address, 'Address created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateAddressSchema.parse(req.body);
      const address = await userService.updateAddress(
        req.user!.userId,
        req.params.addressId,
        data
      );
      sendSuccess(res, address, 'Address updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.deleteAddress(req.user!.userId, req.params.addressId);
      sendSuccess(res, null, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

