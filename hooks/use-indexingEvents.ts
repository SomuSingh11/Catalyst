"use client";

import { useState, useRef, useCallback } from "react";
import type { IndexingProgress } from "@/types/gitWhiz";

export const useIndexingEvents = () => {
  const [status, setStatus] = useState<IndexingProgress["status"]>("pending");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | undefined>();
  const [current, setCurrent] = useState<number | undefined>();
  const [total, setTotal] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [stats, setStats] = useState<IndexingProgress["stats"] | null>(null);
  const [logs, setLogs] = useState<IndexingProgress[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const startIndexing = useCallback((projectId: string) => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    // Reset all state for a clean run
    setStatus("pending");
    setMessage("Connecting to indexing service...");
    setProgress(0);
    setCurrentFile(undefined);
    setCurrent(undefined);
    setTotal(undefined);
    setError(undefined);
    setStats(null);
    setLogs([]);

    const eventSource = new EventSource(`/api/indexer?projectId=${projectId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data: IndexingProgress = JSON.parse(event.data);

      // Update state with every new event
      setStatus(data.status);
      setMessage(data.message);
      if (data.percentage !== undefined) setProgress(data.percentage);
      if (data.currentFile) setCurrentFile(data.currentFile);
      if (data.current) setCurrent(data.current);
      if (data.total) setTotal(data.total);
      if (data.stats) setStats(data.stats);
      if (data.error) setError(data.error);

      setLogs((prev) => [...prev, data]); // Always add to the historical log

      if (data.status === "completed" || data.status === "error") {
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setStatus("error");
      setMessage("A connection error occurred.");
      setError("The connection to the server was lost.");
      eventSource.close();
    };
  }, []);

  return {
    status,
    message,
    progress,
    current,
    total,
    currentFile,
    error,
    stats,
    logs,
    startIndexing,
  };
};
