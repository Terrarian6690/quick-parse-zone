import { useMemo, useState } from "react";
import { Check, Copy, RotateCcw, ArrowLeftRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { convert, digitHint } from "@/lib/number-convert";
import type { ConverterDef } from "@/lib/converters";
import { cn } from "@/lib/utils";

type Props = { def: ConverterDef };

export function ConverterTool({ def }: Props) {
  const [raw, setRaw] = useState("");
  const [upper, setUpper] = useState(false);
  const [prefix, setPrefix] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => (raw.trim() === "" ? null : convert(raw, def.fromBase, def.toBase)),
    [raw, def.fromBase, def.toBase],
  );

  const hexOut = def.toBase === 16;
  const value = result?.ok ? result.value : "";
  const display = value
    ? `${prefix && hexOut ? "0x" : ""}${hexOut && upper ? value.toUpperCase() : value}`
    : "";

  const copy = async () => {
    if (!display) return;
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setRaw("");
    setCopied(false);
  };

  const errorId = "converter-error";
  const invalid = result != null && !result.ok;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div>
          <label
            htmlFor="converter-input"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {def.fromLabel} input
          </label>
          <textarea
            id="converter-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={3}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            inputMode={def.fromBase === 10 ? "numeric" : "text"}
            placeholder={def.placeholder}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
            className={cn(
              "w-full resize-y rounded-lg border bg-background px-3 py-2.5 font-mono text-lg text-foreground outline-none transition-colors",
              "placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring",
              invalid ? "border-destructive" : "border-input",
            )}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Valid digits: {digitHint(def.fromBase)}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="hidden self-center pt-6 text-muted-foreground md:block"
        >
          <ArrowLeftRight className="size-5" />
        </div>

        <div>
          <label
            htmlFor="converter-output"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {def.toLabel} result
          </label>
          <output
            id="converter-output"
            htmlFor="converter-input"
            aria-live="polite"
            className="block min-h-[6.25rem] w-full break-all rounded-lg border border-input bg-muted/40 px-3 py-2.5 font-mono text-lg text-foreground"
          >
            {display || <span className="text-muted-foreground/60">Result appears here</span>}
          </output>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copy}
              disabled={!display}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-4" />
              Clear
            </button>
            <Link
              to="/$slug"
              params={{ slug: def.inverse }}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Swap direction
            </Link>
          </div>
        </div>
      </div>

      {invalid && (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-destructive">
          {!result.ok && result.error}
        </p>
      )}

      {hexOut && (
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={upper}
              onChange={(e) => setUpper(e.target.checked)}
              className="size-4 accent-[var(--color-primary)]"
            />
            Uppercase output
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefix}
              onChange={(e) => setPrefix(e.target.checked)}
              className="size-4 accent-[var(--color-primary)]"
            />
            Add 0x prefix
          </label>
        </div>
      )}

      {result?.ok && result.steps.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setShowSteps((s) => !s)}
            aria-expanded={showSteps}
            aria-controls="converter-steps"
            className="text-sm font-medium text-foreground underline underline-offset-4"
          >
            {showSteps ? "Hide" : "Show"} step-by-step calculation
          </button>
          {showSteps && (
            <ol id="converter-steps" className="mt-3 space-y-3">
              {result.steps.map((step, i) => (
                <li key={i}>
                  <p className="text-sm font-semibold text-foreground">
                    {i + 1}. {step.label}
                  </p>
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-muted-foreground">
                    {step.detail}
                  </pre>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
