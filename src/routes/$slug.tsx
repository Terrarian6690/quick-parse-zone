import { createFileRoute, notFound } from "@tanstack/react-router";
import { ConverterPage } from "@/components/ConverterPage";
import { CONVERTERS } from "@/lib/converters";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const def = CONVERTERS[params.slug];
    if (!def) throw notFound();
    return { def };
  },
  head: ({ params, loaderData }) => {
    const def = loaderData?.def;
    if (!def) {
      return {
        meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: def.title },
        { name: "description", content: def.description },
        { property: "og:title", content: def.title },
        { property: "og:description", content: def.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/${params.slug}` },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: `/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                name: def.h1,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                url: `/${params.slug}`,
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@type": "FAQPage",
                mainEntity: def.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: ConverterRoute,
});

function ConverterRoute() {
  const { def } = Route.useLoaderData();
  return <ConverterPage def={def} />;
}
