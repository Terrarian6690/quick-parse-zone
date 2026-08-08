/**
 * Shared number conversion engine.
 *
 * All arithmetic uses BigInt so arbitrarily large integers convert exactly,
 * with no IEEE-754 / Number.MAX_SAFE_INTEGER precision loss.
 * Everything here is pure and runs entirely in the browser.
 * Integers only — fractional input is rejected with a clear message.
 */

import { getSystem, shortName, type NumberSystem } from "./number-systems";

export type ConversionStep = { label: string; detail: string };

export type ConversionResult =
  | { ok: true; value: string; decimal: string; steps: ConversionStep[] }
  | { ok: false; error: string };

export function digitHint(sys: NumberSystem): string {
  return sys.charset;
}

/** Strip formatting users routinely paste: spaces, underscores, 0x / 0b / 0o prefixes. */
function normalize(raw: string, sys: NumberSystem): string {
  let s = raw.trim().replace(/[\s_,]/g, "");
  const lower = s.toLowerCase();
  if (sys.base === 16 && lower.startsWith("0x")) s = s.slice(2);
  else if (sys.base === 2 && lower.startsWith("0b")) s = s.slice(2);
  else if (sys.base === 8 && lower.startsWith("0o")) s = s.slice(2);
  if (!sys.caseSensitive) s = s.toUpperCase();
  return s;
}

function digitValue(ch: string, sys: NumberSystem): number {
  return sys.alphabet.indexOf(ch);
}

/** Parse a string written in `sys` into a BigInt. Throws on invalid input. */
export function parseInSystem(raw: string, sys: NumberSystem): bigint {
  let s = normalize(raw, sys);
  let negative = false;
  if (s.startsWith("-")) {
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }

  if (s.length === 0) throw new Error("Enter a value to convert.");
  if (s.includes(".")) {
    throw new Error("This converter works with whole numbers only — remove the decimal point.");
  }

  const bigBase = BigInt(sys.base);
  let out = 0n;

  for (const ch of s) {
    const digit = digitValue(ch, sys);
    if (digit === -1) {
      throw new Error(`"${ch}" is not a valid ${shortName(sys)} digit. ${sys.charset}.`);
    }
    out = out * bigBase + BigInt(digit);
  }

  return negative ? -out : out;
}

/** Format a BigInt using the target system's alphabet. */
export function formatInSystem(value: bigint, sys: NumberSystem): string {
  if (value === 0n) return sys.alphabet.charAt(0);
  const negative = value < 0n;
  let n = negative ? -value : value;
  const bigBase = BigInt(sys.base);
  let out = "";
  while (n > 0n) {
    out = sys.alphabet.charAt(Number(n % bigBase)) + out;
    n /= bigBase;
  }
  return negative ? `-${out}` : out;
}

const MAX_STEPS = 24;

function expansionSteps(raw: string, sys: NumberSystem, decimal: string): ConversionStep[] {
  if (sys.base === 10) return [];
  const s = normalize(raw, sys).replace(/^[-+]/, "");
  if (s.length > MAX_STEPS) {
    return [
      {
        label: "Positional expansion",
        detail: `Each of the ${s.length} digits is multiplied by ${sys.base} raised to its position, then summed. The full expansion is omitted here because the number is long.`,
      },
    ];
  }
  const lines: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const digit = digitValue(s.charAt(i), sys);
    const power = s.length - 1 - i;
    const term = BigInt(digit) * BigInt(sys.base) ** BigInt(power);
    lines.push(`${s.charAt(i)} → ${digit} × ${sys.base}^${power} = ${term}`);
  }
  return [
    {
      label: `Expand each ${shortName(sys)} digit by its place value`,
      detail: lines.join("\n"),
    },
    { label: "Add the terms together", detail: `= ${decimal} in decimal` },
  ];
}

function divisionSteps(value: bigint, sys: NumberSystem): ConversionStep[] {
  if (sys.base === 10) return [];
  const n0 = value < 0n ? -value : value;
  if (n0 === 0n) {
    return [{ label: `Divide by ${sys.base}`, detail: "0 is written as 0 in every base." }];
  }
  const rows: string[] = [];
  const bigBase = BigInt(sys.base);
  let n = n0;
  let count = 0;
  while (n > 0n && count < MAX_STEPS) {
    const q = n / bigBase;
    const r = n % bigBase;
    rows.push(`${n} ÷ ${sys.base} = ${q} remainder ${r} → ${sys.alphabet.charAt(Number(r))}`);
    n = q;
    count++;
  }
  if (n > 0n) rows.push("… (remaining steps omitted)");
  return [
    { label: `Divide repeatedly by ${sys.base}, keeping each remainder`, detail: rows.join("\n") },
    {
      label: "Read the remainders bottom-to-top",
      detail: `That sequence of digits is the ${shortName(sys)} result.`,
    },
  ];
}

/**
 * Convert a value between two systems and build the step-by-step working.
 * Never throws: invalid input comes back as `{ ok: false, error }`.
 */
export function convert(raw: string, from: NumberSystem, to: NumberSystem): ConversionResult {
  try {
    const value = parseInSystem(raw, from);
    const decimal = value.toString(10);
    const steps: ConversionStep[] = [
      ...expansionSteps(raw, from, decimal),
      ...divisionSteps(value, to),
    ];
    return { ok: true, value: formatInSystem(value, to), decimal, steps };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid input." };
  }
}

export type BatchRow = { input: string; output: string; error?: string };

/** Convert one value per line. Blank lines are skipped. */
export function convertBatch(raw: string, from: NumberSystem, to: NumberSystem): BatchRow[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const r = convert(line, from, to);
      return r.ok ? { input: line, output: r.value } : { input: line, output: "", error: r.error };
    });
}

/** Convenience for legacy call sites that work in plain numeric bases. */
export function convertBases(raw: string, fromBase: number, toBase: number): ConversionResult {
  const from = getSystem(`base-${fromBase}`);
  const to = getSystem(`base-${toBase}`);
  if (!from || !to) return { ok: false, error: "Unsupported base." };
  return convert(raw, from, to);
}
