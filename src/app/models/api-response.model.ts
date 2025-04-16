export interface SuccessResponse<T> {
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
