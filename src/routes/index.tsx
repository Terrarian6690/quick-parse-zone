import { createFileRoute, Link } from "@tanstack/react-router";
import { CONVERTER_LIST } from "@/lib/converters";

const title = "Free Number Converters — Binary, Decimal & Hex";
const description =
  "Fast, free number base converters. Convert between binary, decimal and hexadecimal instantly in your browser — no signup, no data sent anywhere.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Free online number converters
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Instant, exact conversion between binary, decimal and hexadecimal. Everything runs in your
        browser — your input is never sent to a server, and even very large numbers convert without
        rounding.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CONVERTER_LIST.map((c) => (
          <li key={c.slug}>
            <Link
              to="/$slug"
              params={{ slug: c.slug }}
              className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <span className="block font-semibold text-foreground">{c.h1}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {c.fromLabel} to {c.toLabel}, with step-by-step working.
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
