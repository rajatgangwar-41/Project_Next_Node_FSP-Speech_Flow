"use client";

import { Button } from "@/components/ui/button";
import { Mic, Upload, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-full relative overflow-hidden bg-linear-to-br from-blue-50/70 via-purple-50/50 to-indigo-50/40">
      {/* Glow background */}
      <div className="absolute w-100 h-100 bg-blue-400/20 blur-3xl rounded-full -bg-conic-300top-25] -bg-conic-300left-25]" />
      <div className="absolute w-100 h-100 bg-indigo-400/20 blur-3xl rounded-full -bottom-25 -right-25" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6">
          <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            AI Powered Transcription
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">
          Turn Voice into Text
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg text-slate-600 max-w-2xl">
          Record audio or upload files and get accurate transcriptions
          instantly. Fast, clean, and built for developers.
        </p>

        {/* CTA */}
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link href="/transcribe">
            <Button
              size="lg"
              className="gap-2 bg-linear-to-r p-6 from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg text-lg"
            >
              <Mic className="h-8 w-8" />
              Start Recording
            </Button>
          </Link>

          <Link href="/transcribe">
            <Button variant="outline" size="lg" className="gap-2 p-6 text-lg">
              <Upload className="h-8 w-8" />
              Upload Audio
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 w-full">
          {[
            {
              icon: Mic,
              title: "Live Recording",
              desc: "Capture audio directly from your microphone",
            },
            {
              icon: Upload,
              title: "File Upload",
              desc: "Upload MP3, WAV, WebM and more",
            },
            {
              icon: Sparkles,
              title: "Smart Transcription",
              desc: "Fast and accurate AI-powered results",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-slate-200/60 shadow-md hover:shadow-lg transition flex flex-col justify-center items-center"
            >
              <item.icon className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
