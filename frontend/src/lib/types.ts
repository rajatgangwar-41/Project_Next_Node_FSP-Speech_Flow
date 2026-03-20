export type TranscriptItem = {
  id: string;
  createdAt: string;
  text: string;
  title: string;
};

export type TranscribeResponse = {
  success: boolean;
  error?: string;
  item?: TranscriptItem | TranscriptItem[];
};
