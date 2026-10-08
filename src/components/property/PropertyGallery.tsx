"use client";

import { useState } from "react";
import { PropertyMedia } from "@/components/media/PropertyMedia";
import { SoldStamp } from "@/components/property/SoldStamp";
import { isVideoMediaUrl } from "@/lib/media-utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  sold?: boolean;
}

export function PropertyGallery({ images, title, sold = false }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : ["/uploads/placeholder.jpg"];
  const activeSrc = gallery[activeIndex];

  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[var(--color-paper-3)]">
        <PropertyMedia
          src={activeSrc}
          alt={`${title} — ${isVideoMediaUrl(activeSrc) ? "vídeo" : "foto"} ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
          controls={isVideoMediaUrl(activeSrc)}
        />
        {sold && <SoldStamp size="detail" />}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? gallery.length - 1 : i - 1))
              }
              aria-label="Anterior"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-navy)]/80 text-[var(--color-on-navy)] transition-colors hover:bg-[var(--color-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i === gallery.length - 1 ? 0 : i + 1))
              }
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-navy)]/80 text-[var(--color-on-navy)] transition-colors hover:bg-[var(--color-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 z-20 rounded-sm bg-[var(--color-navy)]/80 px-2 py-1 text-xs text-[var(--color-on-navy)]">
              {activeIndex + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          {gallery.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver ${isVideoMediaUrl(item) ? "vídeo" : "foto"} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                index === activeIndex
                  ? "border-[var(--color-accent)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <PropertyMedia src={item} alt="" fill className="object-cover" sizes="96px" />
              {isVideoMediaUrl(item) && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--color-navy)]/40 text-xs font-semibold text-[var(--color-on-navy)]">
                  ▶
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
