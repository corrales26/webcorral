"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : ["/uploads/placeholder.jpg"];

  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[var(--color-paper-3)]">
        <Image
          src={gallery[activeIndex]}
          alt={`${title} — foto ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? gallery.length - 1 : i - 1))
              }
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-navy)]/80 text-[var(--color-on-navy)] transition-colors hover:bg-[var(--color-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i === gallery.length - 1 ? 0 : i + 1))
              }
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-navy)]/80 text-[var(--color-on-navy)] transition-colors hover:bg-[var(--color-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-sm bg-[var(--color-navy)]/80 px-2 py-1 text-xs text-[var(--color-on-navy)]">
              {activeIndex + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                index === activeIndex
                  ? "border-[var(--color-accent)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
