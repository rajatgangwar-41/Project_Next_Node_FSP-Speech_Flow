import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TranscriptItem } from "@/lib/types";
import { Loader2, AlertCircle, Calendar, Volume2 } from "lucide-react";

interface TranscriptionResultCardProps {
  transcriptItem: TranscriptItem | null;
  error: string | null;
  isPending: boolean;
}

export default function TranscriptionResultCard({
  transcriptItem,
  error,
  isPending,
}: TranscriptionResultCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/30 rounded-2xl flex flex-col transition-all hover:shadow-xl hover:shadow-slate-300/40">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-heading text-slate-800 flex items-center gap-2">
          Transcription
          {!isPending && transcriptItem?.title && (
            <span className="text-slate-500 text-xl font-normal">
              — {transcriptItem.title}
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-slate-500 mt-1.5 flex items-center gap-1.5">
          {!isPending && transcriptItem?.createdAt ? (
            <>
              <Calendar className="h-4 w-4 text-indigo-500/80" />
              <span>Created: {formatDate(transcriptItem.createdAt)}</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-slate-400" />
              <span>Ready to transcribe</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-red-600">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">Error</p>
            <p className="text-sm mt-2 max-w-md">{error}</p>
          </div>
        ) : isPending ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-600 font-medium">
              Processing your audio...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              This may take a few moments
            </p>
          </div>
        ) : transcriptItem && transcriptItem.text?.trim() ? (
          <div className="prose prose-slate max-w-none leading-relaxed text-lg">
            <p className="whitespace-pre-wrap wrap-break-word text-slate-800">
              {transcriptItem.text}
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-8">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 flex items-center justify-center shadow-sm">
              <Volume2
                className="h-10 w-10 text-indigo-500/70"
                strokeWidth={1.4}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-slate-800">
                Waiting for your voice
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-md">
                Capture thoughts, meetings, or ideas — then let the magic
                happen.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-slate-400">
                Click{" "}
                <span className="font-medium text-indigo-600">Transcribe</span>{" "}
                when you{"'"}re ready
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
