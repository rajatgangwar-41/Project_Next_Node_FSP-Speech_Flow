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
import { Mic, MicOff, Upload, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioControlsCardProps {
  isRecording: boolean;
  audioUrl: string | null;
  hasAudio: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearAudio: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isPending: boolean;
}

export default function AudioControlsCard({
  isRecording,
  audioUrl,
  hasAudio,
  startRecording,
  stopRecording,
  handleFileUpload,
  clearAudio,
  fileInputRef,
  isPending,
}: AudioControlsCardProps) {
  return (
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
                onClick={isRecording ? stopRecording : startRecording}
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
            <audio controls src={audioUrl} className="w-full rounded-lg" />
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-slate-100/80 pt-6 flex justify-between text-sm">
        <Badge variant="secondary">
          {hasAudio ? "Audio ready" : "No audio yet"}
        </Badge>
        {hasAudio && (
          <Button variant="ghost" size="sm" onClick={clearAudio}>
            Clear
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
