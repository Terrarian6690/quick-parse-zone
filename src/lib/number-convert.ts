/**
 * Shared number conversion engine.
 *
 * All arithmetic uses BigInt so arbitrarily large integers convert exactly,
 * with no IEEE-754 / Number.MAX_SAFE_INTEGER precision loss.
 * Everything here is pure and runs entirely in the browser.
 */

export const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export type ConversionStep = {
  label: string;
  detail: string;
};

export type ConversionResult =
  | { ok: true; value: string; decimal: string; steps: ConversionStep[] }
  | { ok: false; error: string };

export function baseName(base: number): string {
  switch (base) {
    case 2:
      return "binary";
    case 8:
      return "octal";
    case 10:
      return "decimal";
    case 16:
      return "hexadecimal";
    default:
      return `base-${base}`;
  }
}

function allowedDigits(base: number): string {
  return DIGITS.slice(0, base);
}

/** Human readable list of the characters valid in a given base. */
export function digitHint(base: number): string {
  if (base <= 10) return `0-${base - 1}`;
  return `0-9 and A-${DIGITS.charAt(base - 1).toUpperCase()}`;
}

/** Strip formatting users routinely paste: spaces, underscores, 0x / 0b prefixes. */
function normalize(raw: string, base: number): string {
  let s = raw.trim().toLowerCase().replace(/[\s_,]/g, "");
  if (base === 16 && s.startsWith("0x")) s = s.slice(2);
  if (base === 2 && s.startsWith("0b")) s = s.slice(2);
  if (base === 8 && s.startsWith("0o")) s = s.slice(2);
  return s;
}

/** Parse a string written in `base` into a BigInt. Throws on invalid input. */
export function parseInBase(raw: string, base: number): bigint {
  let s = normalize(raw, base);
  let negative = false;
  if (s.startsWith("-")) {
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }

  if (s.length === 0) throw new Error("Enter a value to convert.");

  const valid = allowedDigits(base);
  const bigBase = BigInt(base);
  let out = 0n;

  for (const ch of s) {
    const digit = valid.indexOf(ch);
    if (digit === -1) {
      throw new Error(
        `"${ch}" is not a valid ${baseName(base)} digit. Use ${digitHint(base)} only.`,
      );
    }
    out = out * bigBase + BigInt(digit);
  }

  return negative ? -out : out;
}

/** Format a BigInt in the given base. Hex/base>10 output is lowercase. */
export function formatInBase(value: bigint, base: number): string {
  if (value === 0n) return "0";
  const negative = value < 0n;
  let n = negative ? -value : value;
  const bigBase = BigInt(base);
  let out = "";
  while (n > 0n) {
    out = DIGITS.charAt(Number(n % bigBase)) + out;
    n /= bigBase;
  }
  return negative ? `-${out}` : out;
}

const MAX_STEPS = 24;

function expansionSteps(raw: string, fromBase: number): ConversionStep[] {
  if (fromBase === 10) return [];
  const s = normalize(raw, fromBase).replace(/^[-+]/, "");
  if (s.length > MAX_STEPS) {
    return [
      {
        label: "Positional expansion",
        detail: `Each of the ${s.length} digits is multiplied by ${fromBase} raised to its position, then summed. The full expansion is omitted here because the number is long.`,
      },
    ];
  }
  const valid = allowedDigits(fromBase);
  const terms: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const digit = valid.indexOf(s.charAt(i));
    const power = s.length - 1 - i;
    terms.push(`${digit} x ${fromBase}^${power}`);
  }
  return [
    {
      label: `Expand the ${baseName(fromBase)} digits`,
      detail: `${terms.join("  +  ")}`,
    },
  ];
}

function divisionSteps(value: bigint, toBase: number): ConversionStep[] {
  if (toBase === 10) return [];
  const negative = value < 0n;
  let n = negative ? -value : value;
  if (n === 0n) {
    return [{ label: `Divide by ${toBase}`, detail: "0 is written as 0 in every base." }];
  }
  const rows: string[] = [];
  const bigBase = BigInt(toBase);
  let count = 0;
  while (n > 0n && count < MAX_STEPS) {
    const q = n / bigBase;
    const r = n % bigBase;
    rows.push(`${n} / ${toBase} = ${q} remainder ${DIGITS.charAt(Number(r)).toUpperCase()}`);
    n = q;
    count++;
  }
  if (n > 0n) rows.push("... (remaining steps omitted)");
  return [
    {
      label: `Divide repeatedly by ${toBase}`,
      detail: rows.join("\n"),
    },
    {
      label: "Read the remainders bottom-to-top",
      detail: `That sequence of remainders is the ${baseName(toBase)} result.`,
    },
  ];
}

/**
 * Convert a value between two bases and build the step-by-step working.
 * Never throws: invalid input comes back as `{ ok: false, error }`.
 */
export function convert(raw: string, fromBase: number, toBase: number): ConversionResult {
  try {
    const value = parseInBase(raw, fromBase);
    const decimal = value.toString(10);
    const steps: ConversionStep[] = [];

    if (fromBase !== 10) {
      steps.push(...expansionSteps(raw, fromBase));
      steps.push({ label: "Sum the terms", detail: `= ${decimal} in decimal` });
    }
    steps.push(...divisionSteps(value, toBase));

    return { ok: true, value: formatInBase(value, toBase), decimal, steps };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid input." };
  }
}
