export type ApiResponse<T> = {
  status: "success" | "fail";
  data: T;
  message?: string;
  errorCode?: string;
  errors?: Array<string>;
}

export type ErrorResponse = ApiResponse<null>;