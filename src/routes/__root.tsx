import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Free Number Converters" },
      { name: "description", content: "Free, instant binary, decimal and hexadecimal converters." },
      { property: "og:site_name", content: "Number Converters" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const navLink =
    "relative text-muted-foreground transition-colors hover:text-foreground";
  const navActive = {
    className:
      "relative text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-primary",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 select-none overflow-hidden font-mono text-[11px] leading-8 text-primary/[0.045]"
        >
          <div className="absolute -left-6 top-24 rotate-90 whitespace-nowrap">
            01001000 01100101 01111000 00101101 01000010 01100001 01110011 01100101
          </div>
          <div className="absolute right-2 top-8 whitespace-nowrap">A7 F3 19 00 1C 2D 8E FF 04 B1</div>
          <div className="absolute bottom-16 left-8 whitespace-nowrap">10110101 00101001 11000110 01010101</div>
        </div>

        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
          <nav
            aria-label="Main"
            className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3"
          >
            <Link to="/" className="font-mono text-sm font-bold tracking-tight text-foreground">
              <span className="text-primary">$</span> convert
              <span className="text-muted-foreground">ly</span>
            </Link>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <Link to="/$slug" params={{ slug: "base" }} className={navLink} activeProps={navActive}>
                Number Bases
              </Link>
              <Link to="/$slug" params={{ slug: "text" }} className={navLink} activeProps={navActive}>
                Text &amp; ASCII
              </Link>
              <Link to="/$slug" params={{ slug: "ciphers" }} className={navLink} activeProps={navActive}>
                Ciphers
              </Link>
              <Link
                to="/$slug"
                params={{ slug: "custom-text-encoder" }}
                className={navLink}
                activeProps={navActive}
              >
                Other Tools
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 font-mono text-xs text-muted-foreground">
            Free number base converters. All conversions run locally in your browser.
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}


