/**
 * Text / alphabet conversion engine.
 *
 * Pure functions, no UI, no network. UTF-8 aware where it matters.
 */

export type TextResult = { ok: true; value: string } | { ok: false; error: string };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesOf(text: string): Uint8Array {
  return encoder.encode(text);
}

/* ---------------------------------- binary --------------------------------- */

export function textToBinary(text: string): TextResult {
  if (text === "") return { ok: false, error: "Enter some text to convert." };
  const out = Array.from(bytesOf(text)).map((b) => b.toString(2).padStart(8, "0"));
  return { ok: true, value: out.join(" ") };
}

export function binaryToText(raw: string): TextResult {
  const cleaned = raw.replace(/[\s_,]/g, "");
  if (cleaned === "") return { ok: false, error: "Enter binary digits to convert." };
  if (/[^01]/.test(cleaned)) {
    return { ok: false, error: "Binary input may only contain the digits 0 and 1." };
  }
  if (cleaned.length % 8 !== 0) {
    return {
      ok: false,
      error: `Binary text is read in groups of 8 bits. You entered ${cleaned.length} bits, which is not a multiple of 8.`,
    };
  }
  const bytes = new Uint8Array(cleaned.length / 8);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.slice(i * 8, i * 8 + 8), 2);
  }
  try {
    return { ok: true, value: decoder.decode(bytes) };
  } catch {
    return { ok: false, error: "Those bytes are not valid UTF-8 text." };
  }
}

/* ---------------------------------- ASCII ---------------------------------- */

export function textToAscii(text: string): TextResult {
  if (text === "") return { ok: false, error: "Enter some text to convert." };
  const codes: number[] = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (cp > 127) {
      return {
        ok: false,
        error: `"${ch}" is outside the 7-bit ASCII range (0-127). Use the Text to Numbers tool for full Unicode.`,
      };
    }
    codes.push(cp);
  }
  return { ok: true, value: codes.join(" ") };
}

export function asciiToText(raw: string): TextResult {
  const parts = raw.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: "Enter ASCII codes separated by spaces." };
  let out = "";
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return { ok: false, error: `"${p}" is not a whole number.` };
    const n = Number(p);
    if (n > 127) return { ok: false, error: `${n} is outside the ASCII range 0-127.` };
    out += String.fromCodePoint(n);
  }
  return { ok: true, value: out };
}

/* --------------------------------- numbers --------------------------------- */

/**
 * Text → Numbers uses Unicode code points in decimal, one number per character,
 * separated by single spaces. This is documented, lossless and reversible.
 */
export function textToNumbers(text: string): TextResult {
  if (text === "") return { ok: false, error: "Enter some text to convert." };
  const codes = Array.from(text).map((ch) => ch.codePointAt(0)!);
  return { ok: true, value: codes.join(" ") };
}

export function numbersToText(raw: string): TextResult {
  const parts = raw.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: "Enter code point numbers separated by spaces." };
  let out = "";
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return { ok: false, error: `"${p}" is not a whole number.` };
    const n = Number(p);
    if (n > 0x10ffff) return { ok: false, error: `${n} is not a valid Unicode code point.` };
    try {
      out += String.fromCodePoint(n);
    } catch {
      return { ok: false, error: `${n} is not a valid Unicode code point.` };
    }
  }
  return { ok: true, value: out };
}

/* ---------------------------------- A1Z26 ---------------------------------- */

/**
 * Canonical A1Z26 format:
 *   - letters inside a word are separated by single spaces
 *   - words are separated by a comma + space
 *
 * "HELLO WORLD" → "8 5 12 12 15, 23 15 18 12 4"
 */
export function a1z26Encode(text: string): TextResult {
  if (text.trim() === "") return { ok: false, error: "Enter a message to encode." };
  const words = text.trim().split(/\s+/);
  const encodedWords: string[] = [];
  for (const word of words) {
    const nums: string[] = [];
    for (const ch of word) {
      const upper = ch.toUpperCase();
      if (upper >= "A" && upper <= "Z") {
        nums.push(String(upper.charCodeAt(0) - 64));
      } else {
        return {
          ok: false,
          error: `"${ch}" is not a letter A-Z. A1Z26 encodes letters only — remove digits and punctuation.`,
        };
      }
    }
    if (nums.length > 0) encodedWords.push(nums.join(" "));
  }
  if (encodedWords.length === 0) return { ok: false, error: "Enter at least one letter to encode." };
  return { ok: true, value: encodedWords.join(", ") };
}

/**
 * Decode A1Z26. A space (or the legacy "-" / "|" separators) means the next
 * letter of the same word; a comma starts a new word.
 */
export function a1z26Decode(raw: string): TextResult {
  if (raw.trim() === "") return { ok: false, error: "Enter numbers to decode." };
  const chunks = raw.split(",");
  const words: string[] = [];
  for (const chunk of chunks) {
    const parts = chunk.trim().split(/[\s\-|]+/).filter(Boolean);
    if (parts.length === 0) continue;
    let word = "";
    for (const p of parts) {
      if (!/^\d+$/.test(p)) {
        return { ok: false, error: `"${p}" is not a number. Use numbers 1-26 separated by spaces.` };
      }
      const n = Number(p);
      if (n < 1 || n > 26) {
        return { ok: false, error: `${n} is outside the A1Z26 range of 1-26.` };
      }
      word += String.fromCharCode(64 + n);
    }
    words.push(word);
  }
  if (words.length === 0) return { ok: false, error: "Enter numbers to decode." };
  return { ok: true, value: words.join(" ") };
}

/* --------------------------- fixed substitution ---------------------------- */

export type MappingEntry = { from: string; to: string };

/**
 * Fixed leetspeak-style substitution table used by the Custom Text Encoder.
 * These mappings are intentionally not user-editable.
 */
export const SUBSTITUTION_MAP: MappingEntry[] = [
  { from: "I", to: "1" },
  { from: "Z", to: "2" },
  { from: "E", to: "3" },
  { from: "A", to: "4" },
  { from: "S", to: "5" },
  { from: "G", to: "6" },
  { from: "T", to: "7" },
  { from: "B", to: "8" },
  { from: "O", to: "0" },
];

const ENCODE_TABLE = new Map(SUBSTITUTION_MAP.map((m) => [m.from, m.to]));
const DECODE_TABLE = new Map(SUBSTITUTION_MAP.map((m) => [m.to, m.from]));

/** Replace every mapped letter (case-insensitive) with its fixed digit. */
export function encodeSubstitution(text: string): string {
  let out = "";
  for (const ch of text) {
    out += ENCODE_TABLE.get(ch.toUpperCase()) ?? ch;
  }
  return out;
}

/**
 * Reverse the substitution. Each digit maps back to exactly one letter, so
 * decoding is unambiguous for the encoded digits themselves — but characters
 * that were already digits in the original text cannot be told apart.
 */
export function decodeSubstitution(text: string): string {
  let out = "";
  for (const ch of text) {
    out += DECODE_TABLE.get(ch) ?? ch;
  }
  return out;
}


/* -------------------------------- registry --------------------------------- */

export type TextMode = {
  id: string;
  fromLabel: string;
  toLabel: string;
  placeholder: string;
  run: (input: string) => TextResult;
  inverse: string;
};

export const TEXT_MODES: Record<string, TextMode> = {
  "text-to-binary": {
    id: "text-to-binary",
    fromLabel: "Text",
    toLabel: "Binary (UTF-8)",
    placeholder: "Hello",
    run: textToBinary,
    inverse: "binary-to-text",
  },
  "binary-to-text": {
    id: "binary-to-text",
    fromLabel: "Binary (UTF-8)",
    toLabel: "Text",
    placeholder: "01001000 01101001",
    run: binaryToText,
    inverse: "text-to-binary",
  },
  "text-to-ascii": {
    id: "text-to-ascii",
    fromLabel: "Text",
    toLabel: "ASCII codes",
    placeholder: "Hello",
    run: textToAscii,
    inverse: "ascii-to-text",
  },
  "ascii-to-text": {
    id: "ascii-to-text",
    fromLabel: "ASCII codes",
    toLabel: "Text",
    placeholder: "72 101 108 108 111",
    run: asciiToText,
    inverse: "text-to-ascii",
  },
  "text-to-numbers": {
    id: "text-to-numbers",
    fromLabel: "Text",
    toLabel: "Unicode code points",
    placeholder: "Hello",
    run: textToNumbers,
    inverse: "numbers-to-text",
  },
  "numbers-to-text": {
    id: "numbers-to-text",
    fromLabel: "Unicode code points",
    toLabel: "Text",
    placeholder: "72 101 108 108 111",
    run: numbersToText,
    inverse: "text-to-numbers",
  },
  "a1z26-encode": {
    id: "a1z26-encode",
    fromLabel: "Letters",
    toLabel: "Numbers (A1Z26)",
    placeholder: "HELLO",
    run: a1z26Encode,
    inverse: "a1z26-decode",
  },
  "a1z26-decode": {
    id: "a1z26-decode",
    fromLabel: "Numbers (A1Z26)",
    toLabel: "Letters",
    placeholder: "8 5 12 12 15",
    run: a1z26Decode,
    inverse: "a1z26-encode",
  },
};
