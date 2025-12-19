import { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: Record<string, string[]>
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: PaginatedResponse<T>,
  message = 'Success'
): void => {
  res.status(200).json({
    success: true,
    message,
    ...data,
  });
};

