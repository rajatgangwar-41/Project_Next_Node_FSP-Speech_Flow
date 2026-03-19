"use client";

import { useState, useEffect, useRef, useTransition, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Upload,
  FileAudio,
  Loader2,
  Volume2,
  AlertCircle,
  History,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { toast } from "@/components/ui/use-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
console.log("🚀 ~ BACKEND_URL:", BACKEND_URL);

// ─── History Fetch Component (Suspense-wrapped) ────────────────────────────────
async function fetchHistory() {
  // REPLACE with your real endpoint
  const res = await fetch(BACKEND_URL + "/api/transcribe", {
    cache: "no-store", // or revalidate: 60 etc.
  });

  if (!res.ok) throw new Error("Failed to load history");

  const data = await res.json();
  // Assume shape: { items: [{ id: string, createdAt: string, text: string, title?: string }] }
  return data.items || [];
}

function HistoryList() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple client-side fetch on mount (could also be server component)
  // But for Suspense demo we keep it here
  useEffect(() => {
    fetchHistory()
      .then(setHistory)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle className="h-10 w-10 mb-3" />
        <p className="text-lg font-medium">Failed to load history</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-slate-600">Loading previous transcriptions...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <History className="h-12 w-12 mb-4 opacity-60" />
        <p className="text-lg font-medium">No previous transcriptions</p>
        <p className="text-sm mt-2">Your history will appear here</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {history.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-b last:border-none"
        >
          <AccordionTrigger className="py-3 text-left hover:no-underline">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-slate-800">
                {item.title || item.createdAt?.split("T")[0] || "Transcription"}
              </span>
              <span className="text-xs text-slate-500">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="whitespace-pre-wrap wrap-break-word text-slate-700">
                {item.text}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 gap-1 text-slate-600 hover:text-indigo-600"
              onClick={() => {
                navigator.clipboard.writeText(item.text);
                toast({ description: "Copied to clipboard" });
              }}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function TranscribePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Cannot access microphone. Please allow permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setError("Please upload an audio file (mp3, wav, webm, etc.)");
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioBlob(file);
    setError(null);
    setTranscription("");
  };

  const transcribeAudio = () => {
    if (!audioBlob) return;

    startTransition(async () => {
      setError(null);
      setTranscription("");

      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        // ← Replace with your real endpoint
        const response = await fetch(BACKEND_URL + "/api/transcribe", {
          method: "POST",
          body: formData,
        });
        console.log("🚀 ~ transcribeAudio ~ response:", response);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `HTTP ${response.status}`);
        }

        const data = await response.json();
        // Adjust based on your actual response shape
        setTranscription(
          data.text || data.transcription || data.result || "No text returned",
        );
      } catch (err: any) {
        console.error("Transcription failed:", err);
        setError(err.message || "Failed to transcribe. Try again.");
      }
    });
  };

  const hasAudio = !!audioBlob || !!audioUrl;

  return (
    <div
      className="
        min-h-screen 
        bg-linear-to-br from-blue-50/70 via-purple-50/50 to-indigo-50/40 
        text-slate-950 antialiased 
        relative overflow-hidden
        diagonal-grid-bg
      "
    >
      <div className="flex-1 container mx-auto px-4 py-6 max-w-5xl flex flex-col relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">
            Voice to Text
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Record, upload • View & transcribe history
          </p>
        </div>

        <Tabs defaultValue="new" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 rounded-lg h-10 border border-slate-200/60 mb-4">
            <TabsTrigger value="new" className="text-sm">
              New Transcription
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              History
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex flex-col">
            <TabsContent value="new" className="flex-1 flex flex-col mt-0">
              <div className="grid md:grid-cols-2 gap-6 flex-1">
                {/* <div className="grid md:grid-cols-2 gap-8 lg:gap-10 mb-10"> */}
                {/* Left – Audio Controls */}
                <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/30 rounded-2xl transition-all hover:shadow-xl hover:shadow-slate-300/40">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl font-heading text-slate-800">
                      {isRecording ? (
                        <Mic className="h-6 w-6 text-red-500 animate-pulse" />
                      ) : (
                        <Volume2 className="h-6 w-6 text-indigo-600" />
                      )}
                      Create Audio
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1.5">
                      Speak now or import an audio file
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    <Tabs defaultValue="record" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 rounded-lg h-11 border border-slate-200/60">
                        <TabsTrigger value="record">Record</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                      </TabsList>

                      <TabsContent value="record" className="mt-8">
                        <div className="flex flex-col items-center justify-center">
                          <button
                            onClick={
                              isRecording ? stopRecording : startRecording
                            }
                            disabled={isPending}
                            className={cn(
                              "relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 shadow-lg",
                              isRecording
                                ? "bg-red-500 hover:bg-red-600 shadow-red-400/40"
                                : "bg-linear-to-br from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-indigo-400/40",
                              "active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300/30",
                            )}
                          >
                            {isRecording ? (
                              <MicOff className="h-10 w-14 text-white" />
                            ) : (
                              <Mic className="h-10 w-14 text-white" />
                            )}
                            {isRecording && (
                              <span className="absolute inset-0 rounded-full bg-red-400/25 animate-ping-slow pointer-events-none" />
                            )}
                          </button>
                          <p className="mt-6 text-lg font-medium text-slate-700">
                            {isRecording ? "Recording..." : "Start recording"}
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="upload" className="mt-8">
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-300/70 rounded-xl bg-white/40 hover:bg-white/60 transition-colors">
                          <input
                            type="file"
                            accept="audio/*"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="lg"
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPending}
                          >
                            <Upload className="h-5 w-5" />
                            Choose Audio File
                          </Button>
                          <p className="mt-4 text-sm text-slate-500">
                            MP3, WAV, M4A, WebM • Max 25MB recommended
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {audioUrl && (
                      <div className="pt-4">
                        <audio
                          controls
                          src={audioUrl}
                          className="w-full rounded-lg"
                        />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-slate-100/80 pt-6 flex justify-between text-sm">
                    <Badge variant="secondary">
                      {audioBlob ? "Audio ready" : "No audio yet"}
                    </Badge>
                    {hasAudio && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAudioBlob(null);
                          setAudioUrl(null);
                          setTranscription("");
                          setError(null);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Right – Transcription Result */}
                <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/30 rounded-2xl flex flex-col transition-all hover:shadow-xl hover:shadow-slate-300/40">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-heading text-slate-800">
                      Transcription
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1.5">
                      Result from your server
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
                          Processing...
                        </p>
                      </div>
                    ) : transcription ? (
                      <div className="prose prose-slate max-w-none leading-relaxed text-lg">
                        <p className="whitespace-pre-wrap text-slate-800">
                          {transcription}
                        </p>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                        <FileAudio
                          className="h-16 w-16 mb-5 opacity-60"
                          strokeWidth={1.5}
                        />
                        <p className="text-lg font-medium text-slate-600">
                          Ready to transcribe
                        </p>
                        <p className="text-sm mt-2 max-w-md">
                          Record or upload audio, then click Transcribe below
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Big Transcribe Button – always visible, centered, big */}
              {/* <div className="flex justify-center mt-8 md:mt-12">
          <Button
            onClick={transcribeAudio}
            disabled={!hasAudio || isPending || !audioBlob}
            size="lg"
            className={cn(
              "w-full max-w-md h-16 text-lg font-medium gap-3 shadow-lg transition-all",
              hasAudio && !isPending
                ? "bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                : "bg-slate-300 hover:bg-slate-300 cursor-not-allowed",
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Volume2 className="h-6 w-6" />
                Transcribe Audio
              </>
            )}
          </Button>
        </div> */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={transcribeAudio}
                  disabled={!hasAudio || isPending || !audioBlob}
                  size="lg"
                  className={cn(
                    "w-full max-w-sm h-12 text-base font-medium gap-2 shadow-md transition-all",
                    hasAudio && !isPending
                      ? "bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                      : "bg-slate-300 hover:bg-slate-300 cursor-not-allowed",
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
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-heading text-slate-800 flex items-center gap-2">
                    <History className="h-5 w-5 text-indigo-600" />
                    Previous Transcriptions
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-sm">
                    Your past results from the database
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden pb-0">
                  <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <Suspense
                      fallback={
                        <div className="flex flex-col items-center justify-center h-64">
                          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
                          <p className="text-slate-600">Loading history...</p>
                        </div>
                      }
                    >
                      <HistoryList />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-16 text-center text-sm text-slate-500/80">
          Next.js • Tailwind v4 • shadcn/ui • Your Transcription API
        </div>
      </div>
    </div>
  );
}
