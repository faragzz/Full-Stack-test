import { useState } from "react";

import type { SigninPayload } from "../../sdk/types";
import { getMe, signin } from "../../sdk/auth.api";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useAuthStore } from "../../store/auth.store";

export const useSignin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);

  const mutate = async (payload: SigninPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      await signin(payload);

      const user = await getMe();

      setUser(user);

      return user;
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
