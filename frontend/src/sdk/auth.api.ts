import axiosClient from "../lib/axios";
import type {
  AuthResponse,
  GreetingResponse,
  MeResponse,
  SigninPayload,
  SignupPayload,
} from "./types";
export const signin = async (payload: SigninPayload): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<AuthResponse>(
    "/auth/signin",
    payload,
  );

  return data;
};

export const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<AuthResponse>(
    "/auth/signup",
    payload,
  );

  return data;
};

export const logout = async (): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<AuthResponse>("/auth/logout");

  return data;
};

export const refresh = async (): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<AuthResponse>("/auth/refresh");

  return data;
};

export const greetMe = async (): Promise<GreetingResponse> => {
  const response = await axiosClient.get<GreetingResponse>("/greet");

  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await axiosClient.get<MeResponse>("/users/me");

  return response.data;
};
