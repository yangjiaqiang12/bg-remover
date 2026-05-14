"use client";

interface Props {
  original: string;
  processed: string;
}

export default function ImageCompare({ original, processed }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl">
      <div className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Original
          </span>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[200px] bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2P8z8BQz0BKYBg1YNQAQvGfjRowasCgAgBlTzQ/Sg7k7AAAAABJRU5ErkJggg==')]">
          <img
            src={original}
            alt="Original"
            className="max-h-80 rounded-lg object-contain"
          />
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-emerald-200 dark:border-emerald-800 overflow-hidden bg-white dark:bg-zinc-900 ring-2 ring-emerald-500/20">
        <div className="px-4 py-2 border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Background Removed
          </span>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[200px] bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2P8z8BQz0BKYBg1YNQAQvGfjRowasCgAgBlTzQ/Sg7k7AAAAABJRU5ErkJggg==')]">
          <img
            src={processed}
            alt="Processed"
            className="max-h-80 rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
