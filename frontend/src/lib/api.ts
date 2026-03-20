import { TranscribeResponse, TranscriptItem } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function transcribeAudioFile(
  audioBlob: Blob,
  getClerkToken: () => Promise<string | null>,
): Promise<TranscriptItem> {
  const token = await getClerkToken();
  if (!token) {
    throw new Error("Authentication token not available. Please sign in.");
  }

  const formData = new FormData();
  formData.append(
    "file",
    audioBlob,
    audioBlob instanceof File ? audioBlob.name : "recording.webm",
  );

  const response = await fetch(`${BACKEND_URL}/api/transcribe`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errData = await response.json();
      errorMessage = errData.error || errorMessage;
    } catch {
      errorMessage = (await response.text()) || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data: TranscribeResponse = await response.json();

  if (!data.success || !data.item) {
    throw new Error(data.error || "No transcription returned from server");
  }

  return data.item as TranscriptItem;
}

export async function fetchTranscriptionHistory(
  getClerkToken: () => Promise<string | null>,
): Promise<Array<TranscriptItem>> {
  const token = await getClerkToken();
  if (!token) {
    throw new Error("Authentication required to view history");
  }

  const response = await fetch(`${BACKEND_URL}/api/transcribe`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load history: ${response.status}`);
  }

  const data: TranscribeResponse = await response.json();

  if (!data.success || !Array.isArray(data.item)) {
    throw new Error(data.error || "Invalid history response format");
  }

  return data.item;
}
