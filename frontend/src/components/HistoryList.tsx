"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AlertCircle, History, Loader2, Copy } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { toast } from "sonner";

export default function HistoryList({
  getToken,
}: {
  getToken: () => Promise<string | null>;
}) {
  const { history, isLoading, error } = useHistory({ getToken });

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
      {history.map((item) => {
        return (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-b last:border-none"
          >
            <AccordionTrigger className="py-3 text-left hover:no-underline">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-slate-800">
                  {item.title ||
                    item.createdAt?.split("T")[0] ||
                    "Transcription"}
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
                  toast("Copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
