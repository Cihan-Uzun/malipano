import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: 28, md: 36, lg: 48 }[size];
  const textSize = { sm: "text-lg", md: "text-xl", lg: "text-2xl" }[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="48" height="48" rx="12" fill="#0f2744" />
        <path
          d="M12 32V16h4.5l5.5 10.5L27.5 16H32v16h-3.5V22.5L24 32h-2L17.5 22.5V32H12z"
          fill="#0d9488"
        />
        <circle cx="36" cy="14" r="3" fill="#14b8a6" />
      </svg>
      {showText && (
        <span className={cn("font-bold tracking-tight text-navy", textSize)}>
          Mali<span className="text-teal">Pano</span>
        </span>
      )}
    </div>
  );
}
