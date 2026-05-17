"use client";

import { useState, useCallback, useEffect } from "react";
import { Sparkles, Zap, Shield, UserX, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { track } from "@vercel/analytics";
import ImageUploader from "@/components/ImageUploader";
import ImageCompare from "@/components/ImageCompare";
import DownloadButton from "@/components/DownloadButton";
import { getRemainingUses, recordUse, canUse } from "@/lib/usageLimit";

const features = [
  {
    icon: Zap,
    title: "AI-Powered",
    desc: "State-of-the-art model removes backgrounds with pixel precision in seconds.",
  },
  {
    icon: Shield,
    title: "Always Free",
    desc: "3 removals per day at no cost. No credit card required. No watermarks.",
  },
  {
    icon: UserX,
    title: "No Signup",
    desc: "Start immediately. No registration, no email — just upload and go.",
  },
];

const faqs = [
  {
    q: "How does background removal work?",
    a: "Everything runs in your browser using a WebAssembly AI model. Your images never leave your device — no server upload, complete privacy.",
  },
  {
    q: "What image formats are supported?",
    a: "PNG, JPG, JPEG, WebP, and GIF. Max file size is 15MB. Output is always a transparent PNG.",
  },
  {
    q: "Why only 3 free uses per day?",
    a: "AI processing uses your device's resources. 3 daily uses keeps the experience fast for everyone. Upgrade to Pro for unlimited access.",
  },
];

export default function Home() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [remaining, setRemaining] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    getRemainingUses().then(setRemaining);
  }, []);

  const refreshUsage = useCallback(async () => {
    setRemaining(await getRemainingUses());
  }, []);

  const handleImage = useCallback(async (file: File) => {
    setError(null);
    setProcessedBlob(null);
    setProcessedPreview(null);
    setOriginalPreview(URL.createObjectURL(file));
    await refreshUsage();

    if (!(await canUse())) {
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
      try { await recordUse(); } catch { /* IndexedDB not available */ }
      await refreshUsage();
      track("bg-removal", { free: "true" });
    } catch {
      setError("Processing failed. Try a different image.");
    } finally {
      setProcessing(false);
    }
  }, [refreshUsage]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-white dark:bg-black">
      <header className="sticky top-0 z-10 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-500/30">
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

      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-10 px-6 py-16">
        {/* Hero */}
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Remove Image{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Backgrounds
            </span>{" "}
            Instantly
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-500 leading-relaxed">
            AI-powered background removal in your browser. No upload to any
            server, no signup, no watermarks. Just drag and drop.
          </p>
        </section>

        {/* Feature cards */}
        {!originalPreview && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-xl sm:max-w-3xl">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-5 py-7 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Upload */}
        {!originalPreview && (
          <ImageUploader onImage={handleImage} disabled={false} />
        )}

        {/* Progress */}
        {processing && (
          <div className="flex flex-col items-center gap-4 py-12 w-full max-w-sm">
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ease-out"
                style={{ width: `${progress || 5}%` }}
              />
            </div>
            <p className="text-sm text-zinc-500">{progressLabel}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Upgrade prompt */}
        {!processing && originalPreview && remaining === 0 && (
          <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white px-8 py-10 text-center shadow-sm dark:border-amber-800 dark:from-amber-950/30 dark:to-amber-950/10">
            <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300">
              You&apos;ve used all 3 free attempts today
            </h3>
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Upgrade to Pro for $9/month — unlimited background removals,
              priority processing, and API access.
            </p>
            <button
              className="mt-5 rounded-xl bg-amber-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
              onClick={() => track("upgrade-click")}
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Result */}
        {processedPreview && originalPreview && (
          <>
            <ImageCompare original={originalPreview} processed={processedPreview} />
            <DownloadButton blob={processedBlob} />
          </>
        )}
      </main>

      {/* FAQ */}
      <section className="w-full max-w-2xl px-6 pb-20">
        <h2 className="text-lg font-semibold text-center text-zinc-800 dark:text-zinc-200 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-zinc-500 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full border-t border-zinc-100 py-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
        <p>Built with Claude Code &middot; Powered by IMG.LY</p>
        <p className="mt-1">
          All processing happens locally in your browser. Your images are never uploaded.
        </p>
      </footer>
    </div>
  );
}
