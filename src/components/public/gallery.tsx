"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export function Gallery({ images, title }: Props) {
  const [active, setActive] = useState<string | null>(null);
  if (!images.length) return null;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src) => (
          <button
            key={src}
            type="button"
            className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line"
            onClick={() => setActive(src)}
          >
            <Image src={src} alt={`${title} gallery`} fill className="object-cover" sizes="50vw" />
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal
        >
          <div className="relative h-[70vh] w-full max-w-4xl">
            <Image src={active} alt={title} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      ) : null}
    </>
  );
}
