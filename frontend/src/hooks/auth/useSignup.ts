import { useState } from "react";
import { signup } from "../../sdk/auth.api";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import type { SignupPayload } from "../../sdk/types";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (payload: SignupPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signup(payload);

      return response;
    } catch (error: unknown) {
      setError(getApiErrorMessage(error));

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};
