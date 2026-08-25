import { useState } from "react";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { logout } from "../../sdk/auth.api";
import { useAuthStore } from "../../store/auth.store";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearUser = useAuthStore((state) => state.clearUser);

  const mutate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await logout();

      clearUser();
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
