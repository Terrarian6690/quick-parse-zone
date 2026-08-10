/**
 * Registry of every positional number system the app can convert between.
 * Pure data + lookup helpers — no UI, no side effects.
 */

export const DIGITS36 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export type SystemGroup = "standard" | "extra";

export type NumberSystem = {
  /** Stable id used in URLs and dropdowns, e.g. "base-16". */
  id: string;
  label: string;
  base: number;
  alphabet: string;
  /** When false, alphabetic digits are normalised to upper case before parsing. */
  caseSensitive: boolean;
  group: SystemGroup;
  /** Human-readable description of the character set. */
  charset: string;
};

const NAMED: Record<number, string> = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hexadecimal",
};

function standard(base: number): NumberSystem {
  const alphabet = DIGITS36.slice(0, base);
  const last = alphabet.charAt(alphabet.length - 1);
  const charset =
    base <= 10 ? `Digits 0-${base - 1}` : `Digits 0-9 then letters A-${last} (case-insensitive)`;
  return {
    id: `base-${base}`,
    label: NAMED[base] ? `${NAMED[base]} — Base ${base}` : `Base ${base}`,
    base,
    alphabet,
    caseSensitive: false,
    group: "standard",
    charset,
  };
}

const EXTRA: NumberSystem[] = [
  {
    id: "base-32",
    label: "Base 32",
    base: 32,
    alphabet: DIGITS36.slice(0, 32),
    caseSensitive: false,
    group: "extra",
    charset: "Digits 0-9 then letters A-V (case-insensitive)",
  },
  {
    id: "base-36",
    label: "Base 36",
    base: 36,
    alphabet: DIGITS36,
    caseSensitive: false,
    group: "extra",
    charset: "Digits 0-9 then letters A-Z (case-insensitive)",
  },
  {
    id: "base-58",
    label: "Base 58 — Bitcoin alphabet",
    base: 58,
    alphabet: BASE58_ALPHABET,
    caseSensitive: true,
    group: "extra",
    charset:
      "Bitcoin alphabet: 1-9 and A-Z a-z, excluding 0, O, I and l. Case matters in this system.",
  },
  {
    id: "base-62",
    label: "Base 62",
    base: 62,
    alphabet: BASE62_ALPHABET,
    caseSensitive: true,
    group: "extra",
    charset: "0-9, then A-Z, then a-z. Case matters: 'a' and 'A' are different digits.",
  },
];

export const STANDARD_SYSTEMS: NumberSystem[] = Array.from({ length: 25 }, (_, i) =>
  standard(i + 2),
);

export const EXTRA_SYSTEMS = EXTRA;

export const ALL_SYSTEMS: NumberSystem[] = [...STANDARD_SYSTEMS, ...EXTRA_SYSTEMS];

const BY_ID = new Map(ALL_SYSTEMS.map((s) => [s.id, s]));

export function getSystem(id: string): NumberSystem | undefined {
  return BY_ID.get(id);
}

export function systemByBase(base: number): NumberSystem {
  return getSystem(`base-${base}`) ?? standard(base);
}

export function shortName(sys: NumberSystem): string {
  return NAMED[sys.base] ?? `Base ${sys.base}`;
}
