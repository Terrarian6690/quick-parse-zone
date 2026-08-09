import { useMemo, useState } from "react";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { convert, convertBatch } from "@/lib/number-convert";
import {
  EXTRA_SYSTEMS,
  STANDARD_SYSTEMS,
  getSystem,
  type NumberSystem,
} from "@/lib/number-systems";
import { t } from "@/i18n/en";

type Props = { initialFrom: string; initialTo: string };

function SystemSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: NumberSystem;
  onChange: (sys: NumberSystem) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80"
      >
        {label}
      </label>
      <select
        id={id}
        value={value.id}
        onChange={(e) => {
          const sys = getSystem(e.target.value);
          if (sys) onChange(sys);
        }}
        className="glow-hover min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm font-medium text-foreground"
      >
        <optgroup label="Standard bases">
          {STANDARD_SYSTEMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Popular additional bases">
          {EXTRA_SYSTEMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}


export function NumberConverter({ initialFrom, initialTo }: Props) {
  const [from, setFrom] = useState<NumberSystem>(
    () => getSystem(initialFrom) ?? STANDARD_SYSTEMS[0]!,
  );
  const [to, setTo] = useState<NumberSystem>(
    () => getSystem(initialTo) ?? STANDARD_SYSTEMS[8]!,
  );
  const [raw, setRaw] = useState("");
  const [batch, setBatch] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [upper, setUpper] = useState(true);
  const [prefix, setPrefix] = useState(false);

  const result = useMemo(
    () => (batch || raw.trim() === "" ? null : convert(raw, from, to)),
    [raw, from, to, batch],
  );
  const rows = useMemo(
    () => (batch && raw.trim() !== "" ? convertBatch(raw, from, to) : []),
    [raw, from, to, batch],
  );

  const decorate = (v: string) => {
    if (!v) return "";
    const cased = to.caseSensitive ? v : upper ? v.toUpperCase() : v.toLowerCase();
    return prefix && to.base === 16 ? `0x${cased}` : cased;
  };

  const display = result?.ok ? decorate(result.value) : "";
  const batchText = rows.map((r) => (r.error ? `${r.input}: error` : decorate(r.output))).join("\n");
  const invalid = result != null && !result.ok;
  const errorId = "converter-error";

  const swap = () => {
    setFrom(to);
    setTo(from);
    if (result?.ok) setRaw(result.value);
  };

  return (
    <section
      aria-label="Number base converter"
      className="card-term rounded-2xl p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start">
        {/* FROM */}
        <div className="min-w-0">
          <SystemSelect id="from-system" label={t.converter.from} value={from} onChange={setFrom} />
          <div className={`panel-term mt-2 rounded-xl ${invalid ? "border-destructive" : ""}`}>
            <textarea
              id="converter-input"
              aria-label={`Value in ${from.label}`}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={batch ? 8 : 5}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              inputMode={from.base === 10 ? "numeric" : "text"}
              placeholder={batch ? "1010\n1111\n10001" : "Type a value…"}
              aria-invalid={invalid}
              aria-describedby={invalid ? errorId : "from-charset"}
              className="w-full resize-y rounded-xl bg-transparent px-3 py-3 font-mono text-xl tracking-wide text-foreground outline-none placeholder:text-muted-foreground/50 focus-visible:outline-none"
            />
          </div>
          <p id="from-charset" className="mt-1.5 text-xs text-muted-foreground">
            {t.converter.charset}: {from.charset}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton value={raw} label="Copy input" />
            <button
              type="button"
              onClick={() => setRaw("")}
              className="glow-hover inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
            >
              <RotateCcw className="size-4 accent-primary" aria-hidden="true" />
              {t.converter.clear}
            </button>
          </div>
        </div>

        {/* SWAP */}
        <div className="flex justify-center lg:self-center lg:pt-8">
          <button
            type="button"
            onClick={swap}
            aria-label={t.converter.swap}
            className="glow-hover inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card text-primary"
          >
            <ArrowLeftRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* TO */}
        <div className="min-w-0">
          <SystemSelect id="to-system" label={t.converter.to} value={to} onChange={setTo} />
          {batch ? (
            <pre
              aria-live="polite"
              className="panel-out mt-2 min-h-[11rem] w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl px-3 py-3 font-mono text-lg text-primary"
            >
              {batchText || <span className="text-muted-foreground/60">{t.converter.resultPlaceholder}</span>}
            </pre>
          ) : (
            <output
              key={display}
              id="converter-output"
              htmlFor="converter-input"
              aria-live="polite"
              className="panel-out result-flash mt-2 block min-h-[7.5rem] w-full break-all rounded-xl px-3 py-3 font-mono text-xl tracking-wide text-primary"
            >
              {display || <span className="text-muted-foreground/60">{t.converter.resultPlaceholder}</span>}
            </output>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            {t.converter.charset}: {to.charset}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton value={batch ? batchText : display} label={t.converter.copy} />
          </div>
        </div>
      </div>


      {invalid && (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-destructive">
          {!result.ok && result.error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-sm">
        {!to.caseSensitive && to.base > 10 && (
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={upper}
              onChange={(e) => setUpper(e.target.checked)}
              className="size-4 accent-primary"
            />
            Uppercase letters
          </label>
        )}
        {to.base === 16 && (
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefix}
              onChange={(e) => setPrefix(e.target.checked)}
              className="size-4 accent-primary"
            />
            Add 0x prefix
          </label>
        )}
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={batch}
            onChange={(e) => setBatch(e.target.checked)}
            className="size-4 accent-primary"
          />
          {t.converter.batchMode}
        </label>
        <span className="text-xs text-muted-foreground">{t.converter.integerNotice}</span>
      </div>

      {result?.ok && result.steps.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setShowSteps((s) => !s)}
            aria-expanded={showSteps}
            aria-controls="converter-steps"
            className="font-mono text-sm font-medium text-primary underline underline-offset-4 hover:text-cyan"
          >
            {showSteps ? t.converter.hideCalculation : t.converter.showCalculation}
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
    </section>
  );
}
