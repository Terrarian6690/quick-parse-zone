import { createFileRoute, Link } from "@tanstack/react-router";
import { NumberConverter } from "@/components/NumberConverter";
import { NUMBER_TOOLS, TEXT_TOOLS, CIPHER_TOOLS, OTHER_TOOLS, HUBS } from "@/lib/tools";
import { t } from "@/i18n/en";

const title = "Number, Base & Text Converter — Instant and Free";
const description =
  "Convert numbers between base 2 and base 62, translate text to binary or ASCII, and decode A1Z26 messages instantly. Free, private and entirely in your browser.";

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: t.brand,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          url: "/",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Index,
});

function ToolGrid({ slugs, tools }: { slugs?: string[]; tools: { slug: string; h1: string; description: string }[] }) {
  const list = slugs ? tools.filter((x) => slugs.includes(x.slug)) : tools;
  return (
    <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((c) => (
        <li key={c.slug}>
          <Link
            to="/$slug"
            params={{ slug: c.slug }}
            className="block h-full card-term block h-full rounded-xl p-4"
          >
            <span className="block font-semibold text-foreground">{c.h1}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {c.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Index() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Convert numbers, bases and text instantly
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Pick a system on the left, another on the right, and start typing. Everything runs in your
          browser — nothing you enter is ever sent to a server.
        </p>
      </header>

      <div className="mt-5">
        <NumberConverter initialFrom="base-2" initialTo="base-10" />
      </div>

      <section className="mt-10" aria-labelledby="popular">
        <h2 id="popular" className="text-xl font-semibold text-foreground">
          Popular number conversions
        </h2>
        <ToolGrid tools={NUMBER_TOOLS} />
      </section>

      <section className="mt-10" aria-labelledby="text-tools">
        <h2 id="text-tools" className="text-xl font-semibold text-foreground">
          Text, ASCII and binary tools
        </h2>
        <ToolGrid tools={TEXT_TOOLS.filter((x) => x.category === "text")} />
      </section>

      <section className="mt-10" aria-labelledby="cipher-tools">
        <h2 id="cipher-tools" className="text-xl font-semibold text-foreground">
          A1Z26 and cipher tools
        </h2>
        <ToolGrid tools={[...CIPHER_TOOLS, ...OTHER_TOOLS]} />
      </section>

      <section className="mt-10" aria-labelledby="hubs">
        <h2 id="hubs" className="text-xl font-semibold text-foreground">
          Browse by category
        </h2>
        <ToolGrid tools={HUBS} />
      </section>
    </div>
  );
}
