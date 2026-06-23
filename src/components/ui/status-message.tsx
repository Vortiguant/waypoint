import { cn } from "@/lib/utils";

export function StatusMessage({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "success" | "error";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-accent/25 bg-accent/10 text-ink",
    success: "border-positive/40 bg-positive/10 text-ink",
    error: "border-danger/35 bg-danger/10 text-danger",
  } as const;

  return (
    <div
      className={cn(
        "motion-status rounded-lg border px-4 py-3 text-sm font-semibold leading-6",
        tones[tone],
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
