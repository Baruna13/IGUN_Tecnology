import { cn } from "../utils/cn";

type Tone = "success" | "danger" | "warning" | "primary" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-[#dcfce7] text-[#166534]",
  danger: "bg-[#ffedd5] text-[#7c2d12]",
  warning: "bg-[#fef3c7] text-[#854d0e]",
  primary: "bg-[#dcfce7] text-[#166534]",
  neutral: "bg-[#f0fdf4] text-[#1f2937]",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("badge-pill", TONE_CLASSES[tone], className)}>{children}</span>;
}
