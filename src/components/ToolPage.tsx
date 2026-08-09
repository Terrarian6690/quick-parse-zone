import { Link } from "@tanstack/react-router";
import { NumberConverter } from "@/components/NumberConverter";
import { TextConverter } from "@/components/TextConverter";
import { CustomEncoder } from "@/components/CustomEncoder";
import { TOOLS, type Tool } from "@/lib/tools";
import { t } from "@/i18n/en";

const HUB_LABEL: Record<string, string> = {
  base: "Number Bases",
  text: "Text & ASCII",
  ciphers: "Ciphers",
  other: "Other Tools",
};

const HUB_SLUG: Record<string, string> = {
  base: "base",
  text: "text",
  ciphers: "ciphers",
  other: "text",
};

function ToolLink({ slug }: { slug: string }) {
  const tool = TOOLS[slug];
  if (!tool) return null;
  return (
    <Link
      to="/$slug"
      params={{ slug }}
      className="block card-term rounded-lg px-3 py-2 text-sm text-foreground"
    >
      {tool.h1}
    </Link>
  );
}

export function ToolPage({ tool }: { tool: Tool }) {
  const hubSlug = HUB_SLUG[tool.category]!;

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/$slug" params={{ slug: hubSlug }} className="hover:text-foreground">
              {HUB_LABEL[tool.category]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {tool.h1}
          </li>
        </ol>
      </nav>

      <header className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.h1}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{tool.intro}</p>
      </header>

      <div className="mt-5">
        {tool.kind === "number" && <NumberConverter initialFrom={tool.from} initialTo={tool.to} />}
        {tool.kind === "text" && <TextConverter mode={tool.mode} />}
        {tool.kind === "custom" && <CustomEncoder />}
        {tool.kind === "hub" && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {tool.links.map((slug) => (
              <li key={slug}>
                <ToolLink slug={slug} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {tool.kind !== "hub" && tool.howItWorks && (
        <section className="mt-10" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-xl font-semibold text-foreground">
            {t.sections.howItWorks}
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {tool.howItWorks.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>
      )}

      {tool.kind !== "hub" && tool.example && (
        <section className="mt-8" aria-labelledby="worked-example">
          <h2 id="worked-example" className="text-xl font-semibold text-foreground">
            {t.sections.example}
          </h2>
          <div className="panel-out mt-3 rounded-lg p-4">
            <p className="font-mono text-sm text-foreground">
              {tool.example.input}
              <span className="mx-2 text-muted-foreground">→</span>
              {tool.example.output}
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
              {tool.example.note}
            </p>
          </div>
        </section>
      )}

      {tool.faqs.length > 0 && (
        <section className="mt-8" aria-labelledby="faq">
          <h2 id="faq" className="text-xl font-semibold text-foreground">
            {t.sections.faq}
          </h2>
          <dl className="mt-3 space-y-4">
            {tool.faqs.map((f) => (
              <div key={f.q}>
                <dt className="text-sm font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-8" aria-labelledby="related">
        <h2 id="related" className="text-xl font-semibold text-foreground">
          {t.sections.related}
        </h2>
        {tool.inverse && TOOLS[tool.inverse] && (
          <p className="mt-3 text-sm text-muted-foreground">
            Need the opposite?{" "}
            <Link
              to="/$slug"
              params={{ slug: tool.inverse }}
              className="font-medium text-primary underline underline-offset-4 hover:text-cyan"
            >
              {TOOLS[tool.inverse]!.h1}
            </Link>
          </p>
        )}
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {tool.related.map((slug) => (
            <li key={slug}>
              <ToolLink slug={slug} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link
            to="/$slug"
            params={{ slug: hubSlug }}
            className="font-medium text-primary underline underline-offset-4 hover:text-cyan"
          >
            All {HUB_LABEL[tool.category]?.toLowerCase()} tools
          </Link>
        </p>
      </section>
    </article>
  );
}
