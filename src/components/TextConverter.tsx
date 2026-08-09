import { useMemo, useState } from "react";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { TEXT_MODES, type TextMode } from "@/lib/text-convert";
import { t } from "@/i18n/en";

export function TextConverter({ mode: initialMode }: { mode: string }) {
  const [modeId, setModeId] = useState(initialMode);
  const [raw, setRaw] = useState("");

  const mode: TextMode = TEXT_MODES[modeId] ?? TEXT_MODES["text-to-binary"]!;
  const result = useMemo(() => (raw === "" ? null : mode.run(raw)), [raw, mode]);
  const display = result?.ok ? result.value : "";
  const invalid = result != null && !result.ok;
  const errorId = "text-error";

  const swap = () => {
    const next = TEXT_MODES[mode.inverse];
    if (!next) return;
    setModeId(next.id);
    if (result?.ok) setRaw(result.value);
    else setRaw("");
  };

  return (
    <section aria-label="Text converter" className="card-term rounded-2xl p-4 backdrop-blur-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <label
            htmlFor="text-input"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t.converter.from}: {mode.fromLabel}
          </label>
          <textarea
            id="text-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder={mode.placeholder}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
            className={`w-full resize-y rounded-lg border bg-background px-3 py-3 font-mono text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring ${
              invalid ? "border-destructive" : "border-input"
            }`}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton value={raw} label="Copy input" />
            <button
              type="button"
              onClick={() => setRaw("")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md glow-hover border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {t.converter.clear}
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:self-center lg:pt-8">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap conversion direction"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full glow-hover border border-border bg-card text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeftRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.converter.to}: {mode.toLabel}
          </span>
          <output
            htmlFor="text-input"
            aria-live="polite"
            className="block min-h-[10rem] w-full break-all rounded-lg panel-out px-3 py-3 font-mono text-lg text-foreground"
          >
            {display || <span className="text-muted-foreground/60">{t.converter.resultPlaceholder}</span>}
          </output>
          <div className="mt-2">
            <CopyButton value={display} label={t.converter.copy} />
          </div>
        </div>
      </div>

      {invalid && (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-destructive">
          {!result.ok && result.error}
        </p>
      )}
    </section>
  );
}
