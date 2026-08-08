/**
 * Central English string table.
 *
 * All shared UI copy lives here so additional locales can be added later
 * (e.g. src/i18n/pl.ts) and served from /:locale/* routes without a rewrite.
 */

export const en = {
  brand: "Convertly",
  tagline: "Numbers, bases and text — converted instantly",
  nav: {
    numberBases: "Number Bases",
    textAscii: "Text & ASCII",
    ciphers: "Ciphers",
    other: "Other Tools",
  },
  converter: {
    from: "From",
    to: "To",
    swap: "Swap systems",
    copy: "Copy",
    copied: "Copied",
    clear: "Clear",
    result: "Result",
    resultPlaceholder: "Result appears here",
    showCalculation: "Show calculation",
    hideCalculation: "Hide calculation",
    batchMode: "Batch mode",
    batchHint: "One value per line.",
    integerNotice: "Whole numbers only — decimal fractions are not supported yet.",
    charset: "Character set",
  },
  sections: {
    howItWorks: "How it works",
    example: "Worked example",
    faq: "Frequently asked questions",
    related: "Related tools",
    inverse: "Reverse conversion",
  },
  footer: "All conversions run locally in your browser. Nothing you type is sent to a server.",
} as const;

export type Strings = typeof en;

export const t = en;
