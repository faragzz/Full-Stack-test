import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";

export const AuthInitializer = () => {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  return null;
};
