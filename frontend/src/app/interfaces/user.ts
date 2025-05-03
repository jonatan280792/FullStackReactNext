export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginResponse {
  data: User;
  message: string;
  success: boolean;
  statusCode: number;
}
