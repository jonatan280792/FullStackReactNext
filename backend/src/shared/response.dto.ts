export class ResponseDTO<T = any> {
  data: T | null;
  message: string;
  success: boolean;
  statusCode: number;

  constructor(data: T | null, message = '', success = true, error: any = null, statusCode = 200) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
  }
}