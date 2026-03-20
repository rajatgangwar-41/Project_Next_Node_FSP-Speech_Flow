"use client";

import { useState, useTransition, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioControlsCard from "@/components/AudioControlledCard";
import TranscriptionResultCard from "@/components/TranscriptionResultCard";
import HistoryList from "@/components/HistoryList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Volume2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { transcribeAudioFile } from "@/lib/api";
import { TranscriptItem } from "@/lib/types";
import { toast } from "sonner";

export default function TranscribePage() {
  const [transcription, setTranscription] = useState<TranscriptItem | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { getToken } = useAuth();

  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    handleFileUpload,
    clearAudio,
    fileInputRef,
  } = useAudioRecorder();

  const hasAudio = !!audioBlob || !!audioUrl;

  const transcribeAudio = () => {
    if (!audioBlob) return;

    startTransition(async () => {
      setError(null);
      setTranscription(null);

      try {
        const transcript = await transcribeAudioFile(audioBlob, getToken);
        setTranscription(transcript);
        toast("Transcribe Successful");
      } catch (err) {
        console.error("Transcription failed:", err);
        toast(
          (err as { message: string }).message ||
            "Failed to transcribe. Please try again.",
        );
        setError(
          (err as { message: string }).message ||
            "Failed to transcribe. Please try again.",
        );
      }
    });
  };

  return (
    <div
      className="
        bg-linear-to-br from-blue-50/70 via-purple-50/50 to-indigo-50/40 
        text-slate-950 antialiased 
        relative overflow-hidden
      "
    >
      <div className="flex-1 container mx-auto px-4 py-6 max-w-5xl flex flex-col relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">
            Voice to Text
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Record, Upload, View & Transcribe History
          </p>
        </div>

        <Tabs defaultValue="new" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 rounded-lg h-10 border border-slate-200/60 mb-4">
            <TabsTrigger value="new" className="text-sm">
              New Transcription
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              Transcription History
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex flex-col">
            <TabsContent value="new" className="flex-1 flex flex-col mt-0">
              <div className="grid md:grid-cols-2 gap-6 flex-1">
                <AudioControlsCard
                  isRecording={isRecording}
                  audioUrl={audioUrl}
                  hasAudio={hasAudio}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  handleFileUpload={handleFileUpload}
                  clearAudio={clearAudio}
                  fileInputRef={fileInputRef}
                  isPending={isPending}
                />

                <TranscriptionResultCard
                  transcriptItem={transcription}
                  error={error}
                  isPending={isPending}
                />
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={transcribeAudio}
                  disabled={!hasAudio || isPending || !audioBlob}
                  size="lg"
                  className={cn(
                    "w-full max-w-sm h-12 text-base font-medium gap-2 shadow-md transition-all",
                    hasAudio && !isPending
                      ? "bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed text-white/70",
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5" />
                      Transcribe
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 mt-0">
              <Card className="h-full border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/30 rounded-xl flex flex-col">
                <div className="p-6 pb-4">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    Previous Transcriptions
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Your past results from the database
                  </p>
                </div>
                <div className="flex-1 overflow-hidden pb-0 px-6">
                  <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <Suspense
                      fallback={
                        <div className="flex flex-col items-center justify-center h-64">
                          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
                          <p className="text-slate-600">Loading history...</p>
                        </div>
                      }
                    >
                      <HistoryList getToken={getToken} />
                    </Suspense>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
