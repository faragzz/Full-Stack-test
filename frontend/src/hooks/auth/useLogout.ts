import { useState } from "react";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { logout } from "../../sdk/auth.api";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      return await logout();
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
