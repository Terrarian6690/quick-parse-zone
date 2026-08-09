import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { DEFAULT_MAPPING, applyMapping, reverseMapping, type MappingEntry } from "@/lib/text-convert";

const STORAGE_KEY = "custom-text-encoder-mapping";

export function CustomEncoder() {
  const [mapping, setMapping] = useState<MappingEntry[]>(DEFAULT_MAPPING);
  const [raw, setRaw] = useState("");
  const [decode, setDecode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MappingEntry[];
        if (Array.isArray(parsed)) setMapping(parsed);
      }
    } catch {
      /* ignore malformed local storage */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapping));
    } catch {
      /* storage may be unavailable */
    }
  }, [mapping, hydrated]);

  const output = useMemo(
    () => (raw === "" ? "" : decode ? reverseMapping(raw, mapping) : applyMapping(raw, mapping)),
    [raw, mapping, decode],
  );

  const update = (i: number, patch: Partial<MappingEntry>) =>
    setMapping((m) => m.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const exportMapping = () => {
    const blob = new Blob([JSON.stringify(mapping, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "character-mapping.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-label="Custom text encoder" className="card-term rounded-2xl p-4 backdrop-blur-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="custom-input"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {decode ? "Encoded text" : "Your text"}
          </label>
          <textarea
            id="custom-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder="SIEMA"
            className="w-full resize-y rounded-lg glow-hover border border-border bg-card px-3 py-3 font-mono text-lg text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="min-w-0">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {decode ? "Decoded text" : "Encoded result"}
          </span>
          <output
            htmlFor="custom-input"
            aria-live="polite"
            className="block min-h-[10rem] w-full break-all rounded-lg panel-out px-3 py-3 font-mono text-lg text-foreground"
          >
            {output || <span className="text-muted-foreground/60">Result appears here</span>}
          </output>
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton value={output} />
            <label className="inline-flex min-h-9 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={decode}
                onChange={(e) => setDecode(e.target.checked)}
                className="size-4"
              />
              Decode instead
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h2 className="text-base font-semibold text-foreground">Your character mapping</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit any row. Mappings are matched case-insensitively and saved in this browser only.
        </p>
        <ul className="mt-3 space-y-2">
          {mapping.map((row, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                aria-label={`Source character ${i + 1}`}
                value={row.from}
                maxLength={2}
                onChange={(e) => update(i, { from: e.target.value })}
                className="min-h-11 w-16 rounded-md glow-hover border border-border bg-card px-2 text-center font-mono text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span aria-hidden="true" className="text-muted-foreground">
                →
              </span>
              <input
                aria-label={`Replacement for character ${i + 1}`}
                value={row.to}
                maxLength={4}
                onChange={(e) => update(i, { to: e.target.value })}
                className="min-h-11 w-24 rounded-md glow-hover border border-border bg-card px-2 text-center font-mono text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                aria-label={`Remove mapping row ${i + 1}`}
                onClick={() => setMapping((m) => m.filter((_, idx) => idx !== i))}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md glow-hover border border-border text-foreground transition-colors hover:bg-accent"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMapping((m) => [...m, { from: "", to: "" }])}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md glow-hover border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add row
          </button>
          <button
            type="button"
            onClick={() => setMapping(DEFAULT_MAPPING)}
            className="inline-flex min-h-9 items-center rounded-md glow-hover border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Reset to default
          </button>
          <button
            type="button"
            onClick={exportMapping}
            className="inline-flex min-h-9 items-center rounded-md glow-hover border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Export as JSON
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a substitution and formatting tool. It is not encryption and provides no security.
        </p>
      </div>
    </section>
  );
}
