"use client";

import { useEffect, useState } from "react";
import { fetchTranscriptionHistory } from "@/lib/api";
import { TranscriptItem } from "@/lib/types";

export function useHistory({
  getToken,
}: {
  getToken: () => Promise<string | null>;
}) {
  const [history, setHistory] = useState<TranscriptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTranscriptionHistory(getToken)
      .then((data) => setHistory(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  return { history, isLoading, error };
}
