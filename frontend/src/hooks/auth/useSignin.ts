import { useState } from "react";
import type { SigninPayload } from "../../sdk/types";
import { signin } from "../../sdk/auth.api";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export const useSignin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (payload: SigninPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signin(payload);

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
