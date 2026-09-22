import { cn } from "../utils/cn";

type Tone = "success" | "danger" | "warning" | "primary" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-secondary/15 text-secondary",
  danger: "bg-error-container/40 text-error",
  warning: "bg-tertiary/15 text-tertiary",
  primary: "bg-primary-container/20 text-primary",
  neutral: "bg-surface-container text-on-surface-variant",
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
