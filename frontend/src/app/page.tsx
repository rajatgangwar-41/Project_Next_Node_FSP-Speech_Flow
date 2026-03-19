"use client";

import { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Upload, FileAudio, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TranscribePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [fileTranscription, setFileTranscription] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
        simulateTranscription(blob, setTranscription);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Cannot access microphone. Please allow permission.");
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
      alert("Please upload an audio file");
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioBlob(file);
    simulateTranscription(file, setFileTranscription);
  };

  const simulateTranscription = (
    blob: Blob,
    setter: (text: string) => void,
  ) => {
    setLoading(true);
    setter("");
    setTimeout(() => {
      const fakeText =
        "This is a clean transcription demo. The UI now uses Tailwind v4 font variables properly — Inter for headings, DM Sans for body text. The background has a subtle diagonal grid for depth.";
      setter(fakeText);
      setLoading(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/70 via-purple-50/ to-indigo-50/40 text-slate-950 antialiased relative overflow-hidden diagonal-grid-bg">
      {/* Subtle diagonal grid overlay */}
      <div className="absolute inset-0 diagonal-grid-bg pointer-events-none z-0" />

      <div className="container mx-auto px-5 py-12 md:py-16 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">
            Voice to Text
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-600 font-medium">
            Record live or upload • Instant & readable transcriptions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {/* Controls Card */}
          <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/30 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40">
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
                Speak directly or import an audio file
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-10">
              <Tabs defaultValue="record" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 rounded-lg h-11 border border-slate-200/60">
                  <TabsTrigger
                    value="record"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-indigo-700 data-[state=active]:font-medium"
                  >
                    Record
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-indigo-700 data-[state=active]:font-medium"
                  >
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="record" className="mt-8">
                  <div className="flex flex-col items-center justify-center py-12">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={loading}
                      className={cn(
                        "group relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 ease-out shadow-lg",
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 shadow-red-300/40 ring-1 ring-red-400/30"
                          : "bg-linear-to-br from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-indigo-300/40 ring-1 ring-indigo-400/20",
                        "active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300/30",
                      )}
                    >
                      {isRecording ? (
                        <MicOff className="h-14 w-14 text-white" />
                      ) : (
                        <Mic className="h-14 w-14 text-white" />
                      )}

                      {isRecording && (
                        <span className="absolute inset-0 rounded-full bg-red-400/20 animate-ping-slow pointer-events-none" />
                      )}
                    </button>

                    <p className="mt-8 text-lg font-medium text-slate-700">
                      {isRecording
                        ? "Recording — speak naturally"
                        : "Tap to start recording"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="mt-8">
                  <div className="flex flex-col items-center justify-center py-14 border-2 border-dashed border-slate-300/70 rounded-xl bg-white/40 hover:bg-white/60 transition-colors duration-300">
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
                      className="gap-2 border-slate-300 hover:border-indigo-400 hover:text-indigo-700 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      <Upload className="h-5 w-5" />
                      Select Audio File
                    </Button>
                    <p className="mt-4 text-sm text-slate-500">
                      MP3 • WAV • M4A • WebM • up to 30 MB
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {audioUrl && (
                <div className="pt-5">
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full rounded-xl bg-white/70 shadow-inner border border-slate-200/50"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-slate-100/80 pt-6 flex justify-between items-center text-sm">
              <Badge
                variant="secondary"
                className="bg-slate-100/80 text-slate-700 border border-slate-200/60"
              >
                {audioBlob ? "Audio ready" : "No audio yet"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-indigo-700"
              >
                Clear
              </Button>
            </CardFooter>
          </Card>

          {/* Transcription Card */}
          <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/30 rounded-2xl flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-heading text-slate-800">
                Transcription
              </CardTitle>
              <CardDescription className="text-slate-500 mt-1.5">
                Your spoken content — clear and formatted
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-5" />
                  <p className="text-slate-600 font-medium">
                    Transcribing your audio…
                  </p>
                </div>
              ) : transcription || fileTranscription ? (
                <div className="prose prose-slate max-w-none leading-relaxed text-lg prose-headings:font-heading prose-headings:text-slate-800">
                  <p className="whitespace-pre-wrap text-slate-800">
                    {transcription || fileTranscription}
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <FileAudio
                    className="h-16 w-16 mb-5 opacity-60"
                    strokeWidth={1.5}
                  />
                  <p className="text-lg font-medium text-slate-600">
                    Waiting for input
                  </p>
                  <p className="text-sm mt-2 max-w-md text-slate-500">
                    Record live or upload a file to see transcription appear
                    here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center text-sm text-slate-500/80">
          Next.js • Tailwind v4 • shadcn/ui • MediaRecorder
        </div>
      </div>
    </div>
  );
}
