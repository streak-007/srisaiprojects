"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
};

export function ImageUploadField({ label, value, onChange, folder = "covers" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("project-media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from("project-media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      {value ? (
        <div className="relative aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-line bg-paper">
          <Image src={value} alt="Upload preview" fill className="object-cover" sizes="400px" unoptimized />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <label className="btn-secondary !cursor-pointer !py-2 text-sm">
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={onFileChange}
          />
        </label>
        {value ? (
          <button type="button" className="text-sm font-semibold text-danger" onClick={() => onChange(null)}>
            Remove
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

type GalleryProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

export function GalleryUploadField({ urls, onChange }: GalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `gallery/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("project-media").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("project-media").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...urls, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Gallery images</p>
      {urls.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {urls.map((url) => (
            <div key={url} className="relative aspect-video overflow-hidden rounded-lg border border-line">
              <Image src={url} alt="" fill className="object-cover" sizes="200px" unoptimized />
              <button
                type="button"
                className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-white"
                onClick={() => onChange(urls.filter((u) => u !== url))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <label className="btn-secondary !inline-flex !cursor-pointer !py-2 text-sm">
        {uploading ? "Uploading…" : "Upload gallery images"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={onFileChange}
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
