"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";

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
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative w-full max-w-xl rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer
        ${isDragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
          : "border-zinc-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        }
        ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 rounded-lg object-contain shadow-md"
          />
          <p className="text-sm text-zinc-500">
            Drop a new image or click to replace
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            {isDragActive ? (
              <ImageIcon className="h-8 w-8 text-blue-500" />
            ) : (
              <Upload className="h-8 w-8 text-zinc-400" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
              {isDragActive ? "Drop your image here" : "Drag & drop your image"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              or click to browse &middot; PNG, JPG, WebP &middot; max 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
