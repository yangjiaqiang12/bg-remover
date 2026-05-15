"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon, X } from "lucide-react";

interface Props {
  onImage: (file: File) => void;
  disabled: boolean;
}

export default function ImageUploader({ onImage, disabled }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        const file = accepted[0];
        setPreview(URL.createObjectURL(file));
        onImage(file);
      }
    },
    [onImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxFiles: 1,
    disabled,
    maxSize: 15 * 1024 * 1024,
  });

  return (
    <div className="w-full max-w-xl">
      <div
        {...getRootProps()}
        className={`group relative rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? "bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-500 shadow-lg shadow-blue-500/10 scale-[1.01]"
            : "bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 hover:ring-blue-300 hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-none"
          }
          ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 rounded-xl object-contain shadow-sm"
            />
            <p className="text-sm text-zinc-400">
              Drop a new image or click to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors
                ${isDragActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white dark:bg-zinc-800 text-zinc-400 group-hover:text-blue-500 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                }`}
            >
              {isDragActive ? (
                <ImageIcon className="h-7 w-7" />
              ) : (
                <Upload className="h-7 w-7" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
                {isDragActive ? "Drop your image here" : "Drag & drop your image"}
              </p>
              <p className="mt-1.5 text-sm text-zinc-400">
                or click to browse &middot; PNG, JPG, WebP, GIF &middot; max 15MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
