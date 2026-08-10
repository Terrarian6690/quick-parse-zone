import { useMemo, useState } from "react";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { convertCustom, validateBase, charsetLabel } from "@/lib/custom-bases";
import { t } from "@/i18n/en";

const PRESETS = [-10, -3, -2, 2, 8, 10, 16, 36];

function BaseField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80"
      >
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`glow-hover min-h-11 w-28 rounded-lg border bg-card px-3 py-2 font-mono text-sm text-foreground ${
            error ? "border-destructive" : "border-border"
          }`}
        />
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(String(p))}
              className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-muted-foreground hover:text-primary"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">{charsetLabel(Number(value))}</p>
      )}
    </div>
  );
}

export function CustomBaseConverter() {
  const [fromBase, setFromBase] = useState("10");
  const [toBase, setToBase] = useState("-2");
  const [raw, setRaw] = useState("42");
  const [showSteps, setShowSteps] = useState(false);

  const fromCheck = validateBase(fromBase);
  const toCheck = validateBase(toBase);

  const result = useMemo(() => {
    if (!fromCheck.ok || !toCheck.ok || raw.trim() === "") return null;
    return convertCustom(raw, fromCheck.base, toCheck.base);
  }, [raw, fromCheck.ok && fromCheck.base, toCheck.ok && toCheck.base]);

  const display = result?.ok ? result.value : "";
  const invalid = result != null && !result.ok;

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    if (result?.ok) setRaw(result.value);
  };

  return (
    <section
      aria-label="Custom base converter"
      className="card-term rounded-2xl p-4 backdrop-blur-sm sm:p-6"
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        Supported bases: <span className="font-mono text-foreground">-36 to -2</span> and{" "}
        <span className="font-mono text-foreground">2 to 36</span>. Negative bases are a
        non-standard, experimental way of writing numbers: they encode negative values without a
        minus sign. Base 0, base 1 and fractional bases are not valid positional systems and are
        rejected.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <BaseField
            id="from-base"
            label="From — base"
            value={fromBase}
            onChange={setFromBase}
            error={fromCheck.ok ? undefined : fromCheck.error}
          />
          <div className={`panel-term mt-3 rounded-xl ${invalid ? "border-destructive" : ""}`}>
            <textarea
              id="custom-base-input"
              aria-label="Value to convert"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={4}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              placeholder="Type a value…"
              className="w-full resize-y rounded-xl bg-transparent px-3 py-3 font-mono text-xl text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton value={raw} label="Copy input" />
            <button
              type="button"
              onClick={() => setRaw("")}
              className="glow-hover inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {t.converter.clear}
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:self-center lg:pt-10">
          <button
            type="button"
            onClick={swap}
            aria-label={t.converter.swap}
            className="glow-hover inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card text-primary"
          >
            <ArrowLeftRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0">
          <BaseField
            id="to-base"
            label="To — base"
            value={toBase}
            onChange={setToBase}
            error={toCheck.ok ? undefined : toCheck.error}
          />
          <output
            key={display}
            htmlFor="custom-base-input"
            aria-live="polite"
            className="panel-out result-flash mt-3 block min-h-[7.5rem] w-full break-all rounded-xl px-3 py-3 font-mono text-xl text-primary"
          >
            {display || (
              <span className="text-muted-foreground/60">{t.converter.resultPlaceholder}</span>
            )}
          </output>
          <div className="mt-2">
            <CopyButton value={display} label={t.converter.copy} />
          </div>
        </div>
      </div>

      {invalid && (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {!result.ok && result.error}
        </p>
      )}

      {result?.ok && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="font-mono text-xs text-muted-foreground">
            Decimal value: <span className="text-foreground">{result.decimal}</span>
          </p>
          <button
            type="button"
            onClick={() => setShowSteps((s) => !s)}
            aria-expanded={showSteps}
            className="mt-2 font-mono text-sm font-medium text-primary underline underline-offset-4 hover:text-cyan"
          >
            {showSteps ? t.converter.hideCalculation : t.converter.showCalculation}
          </button>
          {showSteps && (
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-muted-foreground">
              {result.steps.join("\n")}
              {"\n"}Read the digits bottom-to-top to get {display}.
            </pre>
          )}
        </div>
      )}
    </section>
  );
}
