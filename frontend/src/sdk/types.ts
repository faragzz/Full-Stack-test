export type SignupPayload = {
  email: string;
  name: string;
  password: string;
};

export type SigninPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
};

export type LogoutResponse = {
  success: boolean;
};

export type GreetingResponse = string;

export type MeResponse = {
  id: string;
  name: string;
  email: string;
};
