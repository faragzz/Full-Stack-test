import { useEffect, useState } from "react";

import { greetMe } from "../../sdk/auth.api";

export const useMe = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await greetMe();

        setGreeting(response);
      } catch {
        setGreeting(null);
        setError("Unable to load your profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  return {
    greeting,
    isLoading,
    error,
  };
};
