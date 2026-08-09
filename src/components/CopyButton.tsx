import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label = "Copy",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      disabled={!value}
      onClick={async () => {
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-md glow-hover border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-40 ${className}`}
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}
