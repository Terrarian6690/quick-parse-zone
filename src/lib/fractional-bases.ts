/**
 * Experimental fractional-base engine.
 *
 * Kept deliberately separate from the BigInt integer engine in
 * `custom-bases.ts`, which stays untouched and is still used for every
 * integer-base / integer-value conversion.
 *
 * All arithmetic here is exact rational arithmetic over BigInt pairs
 * (numerator / denominator) — no JavaScript floating point is used for the
 * conversion itself, so results are deterministic and free of binary
 * floating-point drift.
 *
 * Supported bases: any rational base b with 1 < b <= 36 (integer or
 * fractional, e.g. 1.5, 2.5, 3.5). Bases <= 1 (including 0.5) cannot form a
 * positional system with a finite digit alphabet and are rejected.
 */

import { DIGITS36 } from "./number-systems";

/** Maximum number of digits produced after the point before truncating. */
export const MAX_FRACTION_DIGITS = 30;

/* ------------------------------- rationals -------------------------------- */

export type Rational = { n: bigint; d: bigint };

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function rat(n: bigint, d: bigint): Rational {
  if (d === 0n) throw new Error("Division by zero.");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}

const ZERO: Rational = { n: 0n, d: 1n };

function add(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d + b.n * a.d, a.d * b.d);
}
function sub(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d - b.n * a.d, a.d * b.d);
}
function mul(a: Rational, b: Rational): Rational {
  return rat(a.n * b.n, a.d * b.d);
}
function div(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d, a.d * b.n);
}
function cmp(a: Rational, b: Rational): number {
  const l = a.n * b.d;
  const r = b.n * a.d;
  return l < r ? -1 : l > r ? 1 : 0;
}
function isZero(a: Rational): boolean {
  return a.n === 0n;
}
function absR(a: Rational): Rational {
  return a.n < 0n ? { n: -a.n, d: a.d } : a;
}
/** floor(a) as a BigInt. */
function floorR(a: Rational): bigint {
  const q = a.n / a.d;
  return a.n < 0n && q * a.d !== a.n ? q - 1n : q;
}

/** Decimal string of a rational, truncated to `places` digits. */
export function rationalToDecimalString(x: Rational, places = 12): string {
  const negative = x.n < 0n;
  const a = absR(x);
  const int = a.n / a.d;
  let rem = a.n % a.d;
  let out = int.toString(10);
  if (rem !== 0n) {
    let frac = "";
    for (let i = 0; i < places && rem !== 0n; i++) {
      rem *= 10n;
      frac += (rem / a.d).toString(10);
      rem %= a.d;
    }
    out += `.${frac}`;
    if (rem !== 0n) out += "…";
  }
  return negative ? `-${out}` : out;
}

/* --------------------------------- bases ---------------------------------- */

export type FractionalBaseCheck =
  | { ok: true; base: Rational; label: string; isInteger: boolean; digitCount: number }
  | { ok: false; error: string };

/** Parse and validate a (possibly fractional) base written in decimal. */
export function validateFractionalBase(raw: string | number): FractionalBaseCheck {
  const text = String(raw).trim();
  if (text === "") return { ok: false, error: "Enter a base." };
  if (!/^-?\d*(\.\d+)?$/.test(text) || text === "." || text === "-") {
    return { ok: false, error: "Enter a base as a decimal number, for example 2, 16 or 1.5." };
  }
  const negative = text.startsWith("-");
  const body = negative ? text.slice(1) : text;
  const [intPart = "0", fracPart = ""] = body.split(".");
  const n = BigInt((intPart === "" ? "0" : intPart) + fracPart);
  const d = 10n ** BigInt(fracPart.length);
  const base = rat(n, d);
  const isInteger = base.d === 1n;

  if (negative) {
    return {
      ok: false,
      error: "Negative fractional bases are not supported. Negative bases must be whole numbers from -36 to -2.",
    };
  }
  if (cmp(base, { n: 1n, d: 1n }) <= 0) {
    return {
      ok: false,
      error:
        "Fractional bases must be greater than 1. A base of 1 or less (such as 0.5) has no finite digit alphabet and cannot represent numbers positionally.",
    };
  }
  if (cmp(base, { n: 36n, d: 1n }) > 0) {
    return { ok: false, error: "Bases above 36 are not supported — there are only 36 digit symbols (0-9, A-Z)." };
  }
  // digits 0 .. ceil(base) - 1
  const digitCount = Number(floorR(base)) + (isInteger ? 0 : 1);
  return {
    ok: true,
    base,
    isInteger,
    digitCount,
    label: rationalToDecimalString(base, 10),
  };
}

export function fractionalDigits(digitCount: number): string {
  return DIGITS36.slice(0, digitCount);
}

/* -------------------------------- parsing --------------------------------- */

/** Parse a value written in a rational base into an exact rational. */
export function parseFractional(raw: string, base: Rational, digitCount: number): Rational {
  const alphabet = fractionalDigits(digitCount);
  let s = raw.trim().replace(/[\s_,]/g, "").toUpperCase();
  let negative = false;
  if (s.startsWith("-")) {
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith("+")) s = s.slice(1);
  if (s === "") throw new Error("Enter a value to convert.");
  if ((s.match(/\./g) ?? []).length > 1) throw new Error("A value may contain at most one point.");

  const [intPart = "", fracPart = ""] = s.split(".");
  if (intPart === "" && fracPart === "") throw new Error("Enter a value to convert.");

  let value = ZERO;
  for (const ch of intPart) {
    const d = alphabet.indexOf(ch);
    if (d === -1) {
      throw new Error(`"${ch}" is not a valid digit in this base. Allowed digits: ${alphabet}.`);
    }
    value = add(mul(value, base), { n: BigInt(d), d: 1n });
  }
  let place = { n: 1n, d: 1n } as Rational;
  for (const ch of fracPart) {
    const d = alphabet.indexOf(ch);
    if (d === -1) {
      throw new Error(`"${ch}" is not a valid digit in this base. Allowed digits: ${alphabet}.`);
    }
    place = div(place, base);
    value = add(value, mul({ n: BigInt(d), d: 1n }, place));
  }
  return negative ? { n: -value.n, d: value.d } : value;
}

/* ------------------------------- formatting -------------------------------- */

export type FormatResult = { value: string; steps: string[]; truncated: boolean };

/**
 * Greedy beta-expansion: for a base b > 1 the digit at place b^i is
 * floor(x / b^i), clamped to the largest available digit. Exact rational
 * arithmetic keeps every step deterministic.
 */
export function formatFractional(
  value: Rational,
  base: Rational,
  digitCount: number,
  maxFractionDigits = MAX_FRACTION_DIGITS,
): FormatResult {
  const alphabet = fractionalDigits(digitCount);
  const maxDigit = BigInt(digitCount - 1);
  const steps: string[] = [];
  if (isZero(value)) return { value: "0", steps: ["0 is written as 0 in every base."], truncated: false };

  const negative = value.n < 0n;
  let x = absR(value);

  // Highest power of the base that still fits into the value.
  let k = 0;
  let power = { n: 1n, d: 1n } as Rational;
  while (cmp(mul(power, base), x) <= 0) {
    power = mul(power, base);
    k += 1;
  }

  let intDigits = "";
  let fracDigits = "";
  let i = k;
  let truncated = false;

  while (true) {
    if (i < 0 && (isZero(x) || -i > maxFractionDigits)) {
      truncated = !isZero(x);
      break;
    }
    let d = floorR(div(x, power));
    if (d > maxDigit) d = maxDigit;
    if (d < 0n) d = 0n;
    if (d > 0n) {
      x = sub(x, mul({ n: d, d: 1n }, power));
      steps.push(
        `place ${i}: digit ${alphabet.charAt(Number(d))} (value ${rationalToDecimalString(mul({ n: d, d: 1n }, power), 8)}), remainder ${rationalToDecimalString(x, 8)}`,
      );
    } else {
      steps.push(`place ${i}: digit 0, remainder ${rationalToDecimalString(x, 8)}`);
    }
    const symbol = alphabet.charAt(Number(d));
    if (i >= 0) intDigits += symbol;
    else fracDigits += symbol;
    power = div(power, base);
    i -= 1;
  }

  const body = (intDigits === "" ? "0" : intDigits) + (fracDigits ? `.${fracDigits}` : "");
  return { value: negative ? `-${body}` : body, steps, truncated };
}

/* -------------------------------- convert ---------------------------------- */

export type FractionalResult =
  | { ok: true; value: string; decimal: string; steps: string[]; truncated: boolean }
  | { ok: false; error: string };

export function convertFractional(
  raw: string,
  from: { base: Rational; digitCount: number },
  to: { base: Rational; digitCount: number },
  maxFractionDigits = MAX_FRACTION_DIGITS,
): FractionalResult {
  try {
    const value = parseFractional(raw, from.base, from.digitCount);
    const out = formatFractional(value, to.base, to.digitCount, maxFractionDigits);
    return {
      ok: true,
      value: out.value,
      decimal: rationalToDecimalString(value, 20),
      steps: out.steps,
      truncated: out.truncated,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid input." };
  }
}
