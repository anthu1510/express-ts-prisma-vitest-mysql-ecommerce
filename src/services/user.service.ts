import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";
import type { CreateAddressInput, UpdateAddressInput } from "../validators/address.validator";

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async createAddress(userId: string, data: CreateAddressInput) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressInput) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    await prisma.address.delete({
      where: { id: addressId },
    });
  }
}

export const userService = new UserService();

