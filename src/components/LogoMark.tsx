import Image from "next/image";

interface LogoMarkProps {
  className?: string;
  priority?: boolean;
}

export function LogoMark({ className = "h-10", priority = false }: LogoMarkProps) {
  return (
    <Image
      src="/logocorral.svg"
      alt=""
      width={656}
      height={492}
      priority={priority}
      unoptimized
      className={`block w-auto shrink-0 object-contain ${className}`}
    />
  );
}
