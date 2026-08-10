/**
 * Custom (experimental) base engine.
 *
 * Supports integer bases -36..-2 and 2..36. Base 0 and base 1 are rejected.
 * All arithmetic uses BigInt so values stay exact.
 */

import { DIGITS36 } from "./number-systems";

export const MIN_NEGATIVE_BASE = -36;
export const MAX_NEGATIVE_BASE = -2;
export const MIN_POSITIVE_BASE = 2;
export const MAX_POSITIVE_BASE = 36;

export type BaseCheck = { ok: true; base: number } | { ok: false; error: string };

/** Validate a user-entered base. Rejects 0, 1, -1, fractions and out-of-range values. */
export function validateBase(raw: string | number): BaseCheck {
  const text = String(raw).trim();
  if (text === "") return { ok: false, error: "Enter a base." };
  if (!/^-?\d+$/.test(text)) {
    return { ok: false, error: "Only whole-number bases are supported — fractional bases are not available." };
  }
  const base = Number(text);
  if (base === 0) return { ok: false, error: "Base 0 does not exist as a positional number system." };
  if (base === 1 || base === -1) {
    return { ok: false, error: `Base ${base} is not a valid positional base. Use -36 to -2 or 2 to 36.` };
  }
  const valid =
    (base >= MIN_NEGATIVE_BASE && base <= MAX_NEGATIVE_BASE) ||
    (base >= MIN_POSITIVE_BASE && base <= MAX_POSITIVE_BASE);
  if (!valid) {
    return { ok: false, error: "Supported bases are -36 to -2 and 2 to 36." };
  }
  return { ok: true, base };
}

export function digitsFor(base: number): string {
  return DIGITS36.slice(0, Math.abs(base));
}

export function charsetLabel(base: number): string {
  const d = digitsFor(base);
  const last = d.charAt(d.length - 1);
  return Math.abs(base) <= 10
    ? `Digits 0-${last}`
    : `Digits 0-9 then letters A-${last} (case-insensitive)`;
}

export type CustomResult =
  | { ok: true; value: string; decimal: string; steps: string[] }
  | { ok: false; error: string };

/** Parse a string written in `base` (may be negative) into a BigInt. */
export function parseCustom(raw: string, base: number): bigint {
  const alphabet = digitsFor(base);
  let s = raw.trim().replace(/[\s_,]/g, "").toUpperCase();
  let negative = false;
  if (s.startsWith("-")) {
    if (base < 0) {
      throw new Error("Negative bases represent negative values without a minus sign — drop the '-'.");
    }
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith("+")) s = s.slice(1);

  if (s === "") throw new Error("Enter a value to convert.");
  if (s.includes(".")) throw new Error("Whole numbers only — remove the decimal point.");

  const b = BigInt(base);
  let out = 0n;
  for (const ch of s) {
    const d = alphabet.indexOf(ch);
    if (d === -1) throw new Error(`"${ch}" is not a valid digit in base ${base}. ${charsetLabel(base)}.`);
    out = out * b + BigInt(d);
  }
  return negative ? -out : out;
}

/** Format a BigInt in `base` (may be negative). Negative bases need no sign. */
export function formatCustom(value: bigint, base: number): { value: string; steps: string[] } {
  const alphabet = digitsFor(base);
  const steps: string[] = [];
  if (value === 0n) return { value: "0", steps: ["0 is written as 0 in every base."] };

  const b = BigInt(base);
  const absB = BigInt(Math.abs(base));

  if (base > 0) {
    const negative = value < 0n;
    let n = negative ? -value : value;
    let out = "";
    while (n > 0n) {
      const q = n / b;
      const r = n % b;
      steps.push(`${n} ÷ ${base} = ${q} remainder ${r} → ${alphabet.charAt(Number(r))}`);
      out = alphabet.charAt(Number(r)) + out;
      n = q;
    }
    return { value: negative ? `-${out}` : out, steps };
  }

  // Negative base: remainders must stay in 0..|base|-1, so a negative remainder
  // is shifted up and the quotient compensated by +1.
  let n = value;
  let out = "";
  while (n !== 0n) {
    let r = n % b;
    let q = n / b;
    if (r < 0n) {
      r += absB;
      q += 1n;
    }
    steps.push(`${n} ÷ ${base} = ${q} remainder ${r} → ${alphabet.charAt(Number(r))}`);
    out = alphabet.charAt(Number(r)) + out;
    n = q;
  }
  return { value: out, steps };
}

export function convertCustom(raw: string, fromBase: number, toBase: number): CustomResult {
  try {
    const value = parseCustom(raw, fromBase);
    const { value: out, steps } = formatCustom(value, toBase);
    return { ok: true, value: out, decimal: value.toString(10), steps };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid input." };
  }
}
