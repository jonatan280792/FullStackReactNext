export class LoginDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  id: string;
  name: string;
  email: string;
  token: string;
}