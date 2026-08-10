import { createFileRoute } from "@tanstack/react-router";
import { UniversalConverter } from "@/components/UniversalConverter";

const title = "Universal Number & Text Converter — Instant and Free";
const description =
  "One universal converter for every number base from 2 to 62, plus text, ASCII and cipher tools. Free, private and entirely in your browser.";

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
          name: "Universal Number & Text Converter",
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

function Index() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Universal Converter
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Pick a number system on the left, another on the right, and start typing. Every base from
          2 to 26 is supported, plus base 32, 36, 58 and 62. Everything runs in your browser —
          nothing you enter is ever sent to a server.
        </p>
      </header>

      <div className="mt-5">
        <UniversalConverter initialFrom="base-2" initialTo="base-10" />
      </div>

      <section className="mt-10" aria-labelledby="about">
        <h2 id="about" className="text-xl font-semibold text-foreground">
          How the universal converter works
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Your input is validated against the digit set of the selected source system.</li>
          <li>
            It is parsed into an exact arbitrary-precision integer, so even hundreds of digits keep
            their precision.
          </li>
          <li>
            The integer is rewritten in the target system by repeated division — open “Show
            calculation” to see the working for your own value.
          </li>
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Use the sidebar to reach the text, ASCII and cipher tools, or the Custom Bases tool for
          experimental negative bases.
        </p>
      </section>
    </div>
  );
}
