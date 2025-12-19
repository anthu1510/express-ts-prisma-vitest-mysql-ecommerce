import { Prisma, OrderStatus } from '@prisma/client';
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";
import type { CreateOrderInput, OrderQueryInput } from "../validators/order.validator";
import type { PaginatedResponse } from "../types";

const TAX_RATE = 0.1; // 10%
const SHIPPING_COST = 10.0;

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } }; address: true };
}>;

export class OrderService {
  async getAll(userId: string, query: OrderQueryInput, isAdmin = false): Promise<PaginatedResponse<OrderWithRelations>> {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = isAdmin ? {} : { userId };

    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
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

  async getById(orderId: string, userId: string, isAdmin = false) {
    const where: Prisma.OrderWhereInput = { id: orderId };

    if (!isAdmin) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: { product: true },
        },
        address: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async create(userId: string, data: CreateOrderInput) {
    const address = await prisma.address.findFirst({
      where: { id: data.addressId, userId },
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_COST;

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId: data.addressId,
          subtotal,
          tax,
          shippingCost: SHIPPING_COST,
          total,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: { product: true },
        },
        address: true,
      },
    });
  }

  async cancel(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('Only pending orders can be cancelled', 400);
    }

    return prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
      });
    });
  }
}

export const orderService = new OrderService();

