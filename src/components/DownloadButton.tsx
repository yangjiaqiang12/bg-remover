"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface Props {
  blob: Blob | null;
}

export default function DownloadButton({ blob }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!blob) return;
    setLoading(true);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bg-removed.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!blob || loading}
      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download Result
    </button>
  );
}
