import { createFileRoute, notFound } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { getTool, type Tool } from "@/lib/tools";
import { getSystem } from "@/lib/number-systems";
import { absoluteUrl } from "@/lib/site";

const DYNAMIC = /^base-(\d+)-to-base-(\d+)$/;

function dynamicTool(slug: string): Tool | undefined {
  const m = DYNAMIC.exec(slug);
  if (!m) return undefined;
  const from = getSystem(`base-${m[1]}`);
  const to = getSystem(`base-${m[2]}`);
  if (!from || !to) return undefined;
  return {
    kind: "number",
    slug,
    category: "base",
    from: from.id,
    to: to.id,
    title: `${from.label} to ${to.label} Converter`,
    h1: `${from.label} to ${to.label} Converter`,
    description: `Convert numbers from ${from.label} to ${to.label} instantly in your browser.`,
    intro: `Convert whole numbers from ${from.label} to ${to.label}. You can change either system without leaving the page.`,
    howItWorks: [
      `Your input is parsed as an exact integer using the ${from.label} digit set.`,
      `The integer is re-expressed in ${to.label} by repeated division.`,
      "Arbitrary-precision arithmetic keeps large values exact.",
    ],
    example: { input: from.charset, output: to.charset, note: "Digit sets used by these two systems." },
    faqs: [],
    related: ["number-base-converter", "binary-to-decimal", "hex-to-decimal", "base-26-converter"],
  };
}

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug) ?? dynamicTool(params.slug);
    if (!tool) throw notFound();
    return { tool, dynamic: !getTool(params.slug) };
  },
  head: ({ params, loaderData }) => {
    const tool = loaderData?.tool;
    if (!tool) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const canonical = absoluteUrl(loaderData?.dynamic ? "/number-base-converter" : `/${params.slug}`);
    const meta = [
      { title: tool.title },
      { name: "description", content: tool.description },
      { property: "og:title", content: tool.title },
      { property: "og:description", content: tool.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary" },
    ];
    if (loaderData?.dynamic) meta.push({ name: "robots", content: "noindex,follow" });

    const graph: Record<string, unknown>[] = [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: tool.h1, item: canonical },
        ],
      },
    ];
    if (tool.kind !== "hub") {
      graph.push({
        "@type": "WebApplication",
        name: tool.h1,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        url: canonical,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      });
    }
    if (tool.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }

    return {
      meta,
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
        },
      ],
    };
  },
  component: ToolRoute,
});

function ToolRoute() {
  const { tool } = Route.useLoaderData();
  // Keyed by slug so all converter state resets when navigating between tools.
  return <ToolPage key={tool.slug} tool={tool} />;
}
