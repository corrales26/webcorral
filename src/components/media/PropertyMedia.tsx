import Image from "next/image";
import { isVideoContentType, isVideoMediaUrl } from "@/lib/media-utils";

interface PropertyMediaProps {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  controls?: boolean;
  contentType?: string;
}

export function PropertyMedia({
  src,
  alt = "",
  className = "object-cover",
  fill,
  sizes,
  priority,
  controls = false,
  contentType,
}: PropertyMediaProps) {
  const isVideo =
    (contentType && isVideoContentType(contentType)) || isVideoMediaUrl(src);

  if (isVideo) {
    const videoClass = fill
      ? `absolute inset-0 h-full w-full ${className}`
      : `w-full ${className}`;

    return (
      <video
        src={src}
        controls={controls}
        playsInline
        muted={!controls}
        preload="metadata"
        className={videoClass}
        aria-label={alt || "Vídeo del inmueble"}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("/api/")}
    />
  );
}
