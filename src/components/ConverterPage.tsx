import { Link } from "@tanstack/react-router";
import { ConverterTool } from "@/components/ConverterTool";
import { CONVERTERS, CONVERTER_LIST, type ConverterDef } from "@/lib/converters";

export function ConverterPage({ def }: { def: ConverterDef }) {
  const inverse = CONVERTERS[def.inverse]!;
  const related = CONVERTER_LIST.filter((c) => c.slug !== def.slug && c.slug !== def.inverse);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{def.h1}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{def.intro}</p>
      </header>

      <div className="mt-5">
        <ConverterTool def={def} />
      </div>

      <section className="mt-10" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-semibold text-foreground">
          How it works
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {def.howItWorks.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8" aria-labelledby="worked-example">
        <h2 id="worked-example" className="text-xl font-semibold text-foreground">
          Worked example
        </h2>
        <div className="mt-3 rounded-lg border border-border bg-muted/40 p-4">
          <p className="font-mono text-sm text-foreground">
            {def.example.input}
            <span className="mx-2 text-muted-foreground">&rarr;</span>
            {def.example.output}
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
            {def.example.note}
          </p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-semibold text-foreground">
          Frequently asked questions
        </h2>
        <dl className="mt-3 space-y-4">
          {def.faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-sm font-semibold text-foreground">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8" aria-labelledby="related">
        <h2 id="related" className="text-xl font-semibold text-foreground">
          Related converters
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Need the opposite?{" "}
          <Link
            to="/$slug"
            params={{ slug: inverse.slug }}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {inverse.h1}
          </Link>
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {related.map((c) => (
            <li key={c.slug}>
              <Link
                to="/$slug"
                params={{ slug: c.slug }}
                className="block rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                {c.h1}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
