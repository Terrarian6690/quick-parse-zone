import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

type Item = { label: string; slug?: string; home?: boolean };
type Group = { title: string; items: Item[] };

export const NAV_GROUPS: Group[] = [
  {
    title: "Converters",
    items: [
      { label: "Universal Converter", home: true },
      { label: "Custom Bases", slug: "custom-bases" },
    ],
  },
  {
    title: "Text",
    items: [
      { label: "Text ↔ Binary", slug: "text-to-binary" },
      { label: "Text ↔ ASCII", slug: "ascii-converter" },
      { label: "Text ↔ Unicode", slug: "text-to-numbers" },
      { label: "Text ↔ Numbers", slug: "numbers-to-text" },
    ],
  },
  {
    title: "Letters & Ciphers",
    items: [
      { label: "A1Z26 Cipher", slug: "a1z26-cipher" },
      { label: "Letter ↔ Number", slug: "letter-to-number-converter" },
      { label: "Custom Text Encoder", slug: "custom-text-encoder" },
    ],
  },
];


function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const base =
    "block rounded-md px-3 py-2 text-sm transition-colors border-l-2 border-transparent";
  const idle = "text-muted-foreground hover:text-foreground hover:bg-card";
  const active = "border-primary bg-primary/10 font-medium text-primary";

  return (
    <nav aria-label="Tools" className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <h2 className="mb-1.5 px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
            {group.title}
          </h2>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const href = item.home ? "/" : `/${item.slug}`;
              const isActive = pathname === href;
              return (
                <li key={item.label}>
                  {item.home ? (
                    <Link to="/" onClick={onNavigate} className={`${base} ${isActive ? active : idle}`}>
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      to="/$slug"
                      params={{ slug: item.slug! }}
                      onClick={onNavigate}
                      className={`${base} ${isActive ? active : idle}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <div className="border-b border-border px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="glow-hover inline-flex min-h-9 items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
        >
          <Menu className="size-4" aria-hidden="true" />
          Tools
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                Number &amp; Text Tools
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border px-3 py-6 lg:block">
        <span className="mb-4 block px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
          Number &amp; Text Tools
        </span>
        <NavList />
      </aside>
    </>
  );
}
