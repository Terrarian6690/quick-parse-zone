import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { SUBSTITUTION_MAP, encodeSubstitution, decodeSubstitution } from "@/lib/text-convert";
import { t } from "@/i18n/en";

export function CustomEncoder() {
  const [raw, setRaw] = useState("");
  const [decode, setDecode] = useState(false);

  const output = useMemo(
    () => (raw === "" ? "" : decode ? decodeSubstitution(raw) : encodeSubstitution(raw)),
    [raw, decode],
  );

  return (
    <section
      aria-label="Custom text encoder"
      className="card-term rounded-2xl p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Direction"
          className="inline-flex overflow-hidden rounded-lg border border-border"
        >
          {[
            { id: "encode", label: "Encode" },
            { id: "decode", label: "Decode" },
          ].map((opt) => {
            const active = (opt.id === "decode") === decode;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => setDecode(opt.id === "decode")}
                className={`min-h-9 px-3 py-1.5 font-mono text-sm ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="encoder-input"
            className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80"
          >
            {decode ? "Encoded text" : "Plain text"}
          </label>
          <div className="panel-term rounded-xl">
            <textarea
              id="encoder-input"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={6}
              spellCheck={false}
              placeholder={decode ? "H3LL0" : "HELLO"}
              className="w-full resize-y rounded-xl bg-transparent px-3 py-3 font-mono text-lg text-foreground outline-none placeholder:text-muted-foreground/50"
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

        <div className="min-w-0">
          <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
            {decode ? "Decoded text" : "Encoded text"}
          </span>
          <output
            htmlFor="encoder-input"
            aria-live="polite"
            className="panel-out block min-h-[10rem] w-full break-all rounded-xl px-3 py-3 font-mono text-lg text-primary"
          >
            {output || (
              <span className="text-muted-foreground/60">{t.converter.resultPlaceholder}</span>
            )}
          </output>
          <div className="mt-2">
            <CopyButton value={output} label={t.converter.copy} />
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h2 className="text-sm font-semibold text-foreground">Fixed substitution table</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          These mappings are fixed and cannot be edited. Every other character passes through
          unchanged. This is a simple substitution/encoding tool — it is not encryption and provides
          no security.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SUBSTITUTION_MAP.map((m) => (
            <li
              key={m.from}
              className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-sm text-foreground"
            >
              {m.from} <span className="text-muted-foreground">→</span>{" "}
              <span className="text-primary">{m.to}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
