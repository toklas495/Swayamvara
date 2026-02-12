import { ApiResponse } from '../types';

export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
    error: null,
  };
};

export const errorResponse = (code: string, message: string): ApiResponse => {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  };
};