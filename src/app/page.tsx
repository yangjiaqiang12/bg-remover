"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImageCompare from "@/components/ImageCompare";
import DownloadButton from "@/components/DownloadButton";
import { getRemainingUses, recordUse, canUse } from "@/lib/usageLimit";

export default function Home() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [remaining, setRemaining] = useState(3);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRemaining(getRemainingUses());
  }, []);

  const handleImage = useCallback(async (file: File) => {
    setError(null);
    setProcessedBlob(null);
    setProcessedPreview(null);
    setOriginalPreview(URL.createObjectURL(file));
    setRemaining(getRemainingUses());

    if (!canUse()) {
      return;
    }

    setProcessing(true);
    setProgress(0);
    setProgressLabel("Downloading AI model...");
    try {
      const { removeBackground } = await import("@imgly/background-removal");

      const blob = await removeBackground(file, {
        model: "isnet_fp16",
        output: {
          format: "image/png",
        },
        progress: (key: string, current: number, total: number) => {
          const pct = Math.round((current / total) * 100);
          setProgress(pct);
          if (key === "download") {
            setProgressLabel(`Downloading AI model... ${pct}%`);
          } else {
            setProgressLabel(`Processing image... ${pct}%`);
          }
        },
      });

      setProcessedBlob(blob);
      setProcessedPreview(URL.createObjectURL(blob));
      recordUse();
      setRemaining(getRemainingUses());
    } catch {
      setError("Processing failed. Try a different image.");
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-white dark:bg-black">
      <header className="w-full border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              BG Remover
            </span>
          </div>
          <div className="text-xs text-zinc-500">
            {remaining > 0 ? (
              <span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {remaining}
                </span>{" "}
                free uses left today
              </span>
            ) : (
              <span className="font-semibold text-amber-600">
                Upgrade for unlimited access
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-8 px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Remove Image Background
          </h1>
          <p className="mt-2 text-zinc-500">
            Upload an image and get a transparent PNG in seconds. 3 free per
            day.
          </p>
        </div>

        {!originalPreview && (
          <ImageUploader onImage={handleImage} disabled={false} />
        )}

        {processing && (
          <div className="flex flex-col items-center gap-4 py-12 w-full max-w-sm">
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress || 5}%` }}
              />
            </div>
            <p className="text-sm text-zinc-500">{progressLabel}</p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {!canUse() && originalPreview && !processing && (
          <div className="w-full max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center dark:border-amber-800 dark:bg-amber-950/20">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
              You&apos;ve used all 3 free attempts today
            </h3>
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Upgrade to Pro for $9/month — unlimited background removals.
            </p>
            <button className="mt-4 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        )}

        {processedPreview && originalPreview && (
          <>
            <ImageCompare original={originalPreview} processed={processedPreview} />
            <DownloadButton blob={processedBlob} />
          </>
        )}
      </main>

      <footer className="w-full border-t border-zinc-100 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
        Built with Claude Code &middot; Powered by IMG.LY
      </footer>
    </div>
  );
}
