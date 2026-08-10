import { TEXT_MODES } from "./text-convert";

export type Faq = { q: string; a: string };

export type BaseTool = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  category: "base" | "text" | "ciphers" | "other";
  howItWorks: string[];
  example: { input: string; output: string; note: string };
  faqs: Faq[];
  related: string[];
  inverse?: string;
};

export type NumberTool = BaseTool & { kind: "number"; from: string; to: string };
export type TextTool = BaseTool & { kind: "text"; mode: keyof typeof TEXT_MODES };
export type CustomTool = BaseTool & { kind: "custom" };
export type CustomBaseTool = BaseTool & { kind: "custom-base" };
export type HubTool = Omit<BaseTool, "example" | "howItWorks"> & {
  kind: "hub";
  howItWorks?: string[];
  example?: BaseTool["example"];
  links: string[];
};

export type Tool = NumberTool | TextTool | CustomTool | CustomBaseTool | HubTool;

const numberTools: NumberTool[] = [
  {
    kind: "number",
    slug: "binary-to-decimal",
    category: "base",
    from: "base-2",
    to: "base-10",
    title: "Binary to Decimal Converter — Instant & Free",
    h1: "Binary to Decimal Converter",
    description:
      "Convert binary to decimal instantly, with step-by-step working. Handles very large binary numbers exactly, free and entirely in your browser.",
    intro:
      "Type or paste a binary number (only 0s and 1s) and read the decimal value straight away. Spaces, underscores and a leading 0b are ignored, and even hundreds of bits stay exact.",
    howItWorks: [
      "Binary is base 2: each position is worth twice the position to its right, starting at 1 on the far right.",
      "Multiply every digit by its place value.",
      "Add the products together — that sum is the decimal value.",
    ],
    example: {
      input: "10110110₂",
      output: "182₁₀",
      note: "128 + 0 + 32 + 16 + 0 + 4 + 2 + 0 = 182",
    },
    faqs: [
      {
        q: "How do I convert binary to decimal by hand?",
        a: "Write the place values 1, 2, 4, 8, 16… under the digits from right to left, then add every place value where the digit is 1.",
      },
      {
        q: "What is 11111111 in decimal?",
        a: "255. Eight 1-bits is the largest value a single byte holds, which is why 255 appears in colour codes and network masks.",
      },
      {
        q: "Can it handle 128-bit numbers?",
        a: "Yes. The engine uses arbitrary-precision integers, so long bit strings convert without rounding.",
      },
    ],
    inverse: "decimal-to-binary",
    related: ["decimal-to-binary", "binary-to-hex", "hex-to-binary", "binary-to-text", "number-base-converter"],
  },
  {
    kind: "number",
    slug: "decimal-to-binary",
    category: "base",
    from: "base-10",
    to: "base-2",
    title: "Decimal to Binary Converter with Working",
    h1: "Decimal to Binary Converter",
    description:
      "Turn any decimal number into binary instantly and see the repeated division-by-2 remainders behind the answer. Free, no signup, runs offline in the browser.",
    intro:
      "Enter a decimal (base 10) whole number to see its binary form as you type. The calculation panel shows the division-by-2 method used in classrooms and exams.",
    howItWorks: [
      "Divide the decimal number by 2 and note the remainder, 0 or 1.",
      "Divide the quotient by 2 again and keep going until the quotient is 0.",
      "Read the remainders from last to first to get the binary number.",
    ],
    example: {
      input: "182₁₀",
      output: "10110110₂",
      note: "182÷2=91 r0, 91÷2=45 r1, 45÷2=22 r1, 22÷2=11 r0, 11÷2=5 r1, 5÷2=2 r1, 2÷2=1 r0, 1÷2=0 r1",
    },
    faqs: [
      { q: "What is 100 in binary?", a: "1100100. Type 100 above to check the remainders yourself." },
      {
        q: "Why read the remainders backwards?",
        a: "The first remainder is the least significant bit, so the sequence has to be reversed to put the largest place value first.",
      },
      {
        q: "Does it work with negative numbers?",
        a: "Yes — a minus sign is kept in front of the magnitude. Two's-complement representation is not applied.",
      },
    ],
    inverse: "binary-to-decimal",
    related: ["binary-to-decimal", "decimal-to-hex", "decimal-to-octal", "number-base-converter", "text-to-binary"],
  },
  {
    kind: "number",
    slug: "hex-to-decimal",
    category: "base",
    from: "base-16",
    to: "base-10",
    title: "Hex to Decimal Converter — Fast & Exact",
    h1: "Hex to Decimal Converter",
    description:
      "Convert hexadecimal values to decimal instantly. Accepts upper or lower case and an optional 0x prefix, with the full place-value calculation shown.",
    intro:
      "Paste a hexadecimal value — with or without the 0x prefix, in any letter case — and read the decimal equivalent immediately.",
    howItWorks: [
      "Hexadecimal is base 16, using 0-9 then A-F for the values 10 to 15.",
      "Each position is worth 16 times the one to its right: 1, 16, 256, 4096…",
      "Multiply each digit by its place value and add the results.",
    ],
    example: { input: "0x1F4", output: "500", note: "1×256 + 15×16 + 4×1 = 256 + 240 + 4 = 500" },
    faqs: [
      { q: "What is FF in decimal?", a: "255 — the maximum value of a two-digit hex number and of one byte." },
      { q: "Is hex case-sensitive?", a: "No. FF, ff and Ff are all read as the same value here." },
      {
        q: "Why is hex used for colours and memory?",
        a: "One hex digit maps exactly to four bits, so bytes and colour channels compress into short, readable pairs.",
      },
    ],
    inverse: "decimal-to-hex",
    related: ["decimal-to-hex", "hex-to-binary", "binary-to-hex", "number-base-converter", "ascii-converter"],
  },
  {
    kind: "number",
    slug: "decimal-to-hex",
    category: "base",
    from: "base-10",
    to: "base-16",
    title: "Decimal to Hex Converter — Free Online",
    h1: "Decimal to Hex Converter",
    description:
      "Convert decimal numbers to hexadecimal instantly, in upper or lower case, with optional 0x prefix and the division-by-16 working.",
    intro:
      "Enter a decimal whole number and get the hexadecimal form as you type. Useful for colour values, memory offsets and byte-level debugging.",
    howItWorks: [
      "Divide the decimal number by 16 and keep the remainder.",
      "Convert remainders 10-15 to the letters A-F.",
      "Repeat until the quotient is 0, then read the remainders bottom-to-top.",
    ],
    example: { input: "500", output: "1F4", note: "500÷16=31 r4, 31÷16=1 r15 (F), 1÷16=0 r1" },
    faqs: [
      { q: "What is 255 in hex?", a: "FF. It is the largest value that fits in two hex digits." },
      {
        q: "Should I add the 0x prefix?",
        a: "Only when the target language needs it. C, JavaScript and Python all accept 0x; CSS colours use # instead.",
      },
      { q: "Upper or lower case?", a: "Both are valid. Use the toggle in the panel to match your codebase style." },
    ],
    inverse: "hex-to-decimal",
    related: ["hex-to-decimal", "decimal-to-binary", "binary-to-hex", "number-base-converter", "text-to-binary"],
  },
  {
    kind: "number",
    slug: "binary-to-hex",
    category: "base",
    from: "base-2",
    to: "base-16",
    title: "Binary to Hex Converter — Instant Conversion",
    h1: "Binary to Hex Converter",
    description:
      "Convert binary to hexadecimal instantly. Group bits into nibbles and get compact hex output, with the calculation shown step by step.",
    intro:
      "Paste any binary string to get the hexadecimal equivalent. Because 16 is a power of 2, the mapping is exact and every four bits become one hex digit.",
    howItWorks: [
      "Split the binary number into groups of four bits, starting from the right.",
      "Pad the leftmost group with leading zeros if it is short.",
      "Replace each group with its hex digit, 0000 = 0 through 1111 = F.",
    ],
    example: { input: "1011 0110", output: "B6", note: "1011 = B, 0110 = 6" },
    faqs: [
      { q: "Why is binary to hex so tidy?", a: "16 is 2⁴, so four binary digits always map onto exactly one hex digit with no carrying." },
      { q: "Do I need to pad the bits?", a: "The tool pads for you; when working on paper, pad the leftmost group to four bits." },
      { q: "Is octal similar?", a: "Yes — octal groups bits in threes instead of fours." },
    ],
    inverse: "hex-to-binary",
    related: ["hex-to-binary", "binary-to-decimal", "hex-to-decimal", "decimal-to-octal", "number-base-converter"],
  },
  {
    kind: "number",
    slug: "hex-to-binary",
    category: "base",
    from: "base-16",
    to: "base-2",
    title: "Hex to Binary Converter — Free Bit Viewer",
    h1: "Hex to Binary Converter",
    description:
      "Expand hexadecimal values into binary bits instantly. Accepts 0x prefixes and any letter case, with a clear nibble-by-nibble explanation.",
    intro:
      "Enter a hex value to see the underlying bits. Handy for reading flags, bitmasks and register values without a calculator.",
    howItWorks: [
      "Take each hex digit on its own.",
      "Write it as four binary digits: 0 = 0000, 9 = 1001, F = 1111.",
      "Join the groups in the same order to form the full binary number.",
    ],
    example: { input: "B6", output: "10110110", note: "B = 1011, 6 = 0110" },
    faqs: [
      { q: "How many bits is one hex digit?", a: "Exactly four, which is why a byte is written with two hex digits." },
      { q: "Why are leading zeros dropped?", a: "The result is a number, so leading zeros carry no value. Pad manually if you need a fixed width." },
      { q: "Can I paste 0xDEADBEEF?", a: "Yes. The 0x prefix and any spacing are stripped automatically." },
    ],
    inverse: "binary-to-hex",
    related: ["binary-to-hex", "hex-to-decimal", "binary-to-decimal", "number-base-converter", "binary-to-text"],
  },
  {
    kind: "number",
    slug: "octal-to-decimal",
    category: "base",
    from: "base-8",
    to: "base-10",
    title: "Octal to Decimal Converter — Free Tool",
    h1: "Octal to Decimal Converter",
    description:
      "Convert octal (base 8) numbers to decimal instantly, with place-value working. Useful for Unix file permissions and legacy systems.",
    intro:
      "Enter an octal number using the digits 0-7 to see its decimal value. A leading 0o is accepted and ignored.",
    howItWorks: [
      "Octal is base 8, so place values run 1, 8, 64, 512…",
      "Multiply each digit by its place value.",
      "Add the products to get the decimal result.",
    ],
    example: { input: "755", output: "493", note: "7×64 + 5×8 + 5×1 = 448 + 40 + 5 = 493" },
    faqs: [
      { q: "Where is octal still used?", a: "Most visibly in Unix file permissions, such as chmod 755." },
      { q: "Why does 8 or 9 fail?", a: "Base 8 only defines the digits 0-7; anything higher is invalid input." },
      { q: "How does octal relate to binary?", a: "Each octal digit is exactly three bits." },
    ],
    inverse: "decimal-to-octal",
    related: ["decimal-to-octal", "binary-to-decimal", "hex-to-decimal", "number-base-converter", "decimal-to-binary"],
  },
  {
    kind: "number",
    slug: "decimal-to-octal",
    category: "base",
    from: "base-10",
    to: "base-8",
    title: "Decimal to Octal Converter with Steps",
    h1: "Decimal to Octal Converter",
    description:
      "Convert decimal numbers to octal (base 8) instantly and see every division-by-8 remainder behind the result.",
    intro:
      "Type a decimal whole number to get its octal form. The step panel shows each division by 8 so the working can be checked.",
    howItWorks: [
      "Divide the number by 8 and record the remainder (0-7).",
      "Continue dividing the quotient by 8 until it reaches 0.",
      "Read the remainders from the bottom up.",
    ],
    example: { input: "493", output: "755", note: "493÷8=61 r5, 61÷8=7 r5, 7÷8=0 r7" },
    faqs: [
      { q: "What is 8 in octal?", a: "10 — octal rolls over one position earlier than decimal." },
      { q: "Is octal used for permissions?", a: "Yes: read=4, write=2, execute=1 are added per user class, giving values like 644 or 755." },
      { q: "Does it accept large numbers?", a: "Yes, arbitrary-precision integers are supported." },
    ],
    inverse: "octal-to-decimal",
    related: ["octal-to-decimal", "decimal-to-binary", "decimal-to-hex", "number-base-converter", "binary-to-hex"],
  },
  {
    kind: "number",
    slug: "base-26-converter",
    category: "base",
    from: "base-10",
    to: "base-26",
    title: "Base 26 Converter — Digits 0-9 and A-P",
    h1: "Base 26 Converter",
    description:
      "Convert numbers to and from base 26 using digits 0-9 followed by letters A-P. Instant, exact and case-insensitive.",
    intro:
      "Base 26 is a positional system with twenty-six digits: 0-9 then A-P. It is not the same as spreadsheet column letters, which use a bijective A-Z system with no zero.",
    howItWorks: [
      "Each position is worth 26 times the position to its right.",
      "Digit values 10 to 25 are written as the letters A to P.",
      "Multiply, add, or divide by 26 depending on the direction of the conversion.",
    ],
    example: { input: "1000₁₀", output: "1CM₂₆", note: "1×676 + 12(C)×26 + 22(M)×1 = 676 + 312 + 12 = 1000" },
    faqs: [
      { q: "Is base 26 the same as Excel columns?", a: "No. Excel uses a bijective base-26 scheme where A=1 and there is no zero digit." },
      { q: "Which letters are used?", a: "A through P only, because 10 digits plus 16 letters gives the 26 symbols needed." },
      { q: "Is input case-sensitive?", a: "No, lower and upper case letters are treated identically." },
    ],
    related: ["number-base-converter", "a1z26-cipher", "letter-to-number-converter", "decimal-to-hex", "binary-to-decimal"],
  },
  {
    kind: "number",
    slug: "number-base-converter",
    category: "base",
    from: "base-2",
    to: "base-16",
    title: "Number Base Converter — Base 2 to Base 62",
    h1: "Universal Number Base Converter",
    description:
      "Convert whole numbers between any bases from 2 to 62, including binary, octal, hex, base 32, 36, 58 and 62. Instant, exact and free.",
    intro:
      "Pick any source and target system and convert as you type. Every standard base from 2 to 26 is available, plus the popular base 32, 36, 58 and 62 alphabets.",
    howItWorks: [
      "Your input is parsed digit by digit into an exact arbitrary-precision integer.",
      "That integer is then re-expressed in the target base by repeated division.",
      "Because BigInt arithmetic is used throughout, no precision is lost at any size.",
    ],
    example: { input: "ZZ₃₆", output: "1295₁₀", note: "35×36 + 35×1 = 1260 + 35 = 1295" },
    faqs: [
      { q: "Which bases are supported?", a: "Every base from 2 to 26 in the main dropdown, plus base 32, 36, 58 (Bitcoin) and 62." },
      { q: "Are fractions supported?", a: "Not yet. The converter handles whole numbers only, and says so when a decimal point is entered." },
      { q: "Is base 58 case-sensitive?", a: "Yes. Base 58 and base 62 distinguish upper and lower case letters; bases up to 36 do not." },
    ],
    related: ["binary-to-decimal", "hex-to-decimal", "base-26-converter", "decimal-to-octal", "binary-to-hex"],
  },
];

const textTools: TextTool[] = [
  {
    kind: "text",
    slug: "text-to-binary",
    mode: "text-to-binary",
    category: "text",
    title: "Text to Binary Converter (UTF-8)",
    h1: "Text to Binary Converter",
    description:
      "Convert text to binary instantly using UTF-8 encoding, so accented letters and emoji work correctly. Free and fully client-side.",
    intro:
      "Type a message to see it as 8-bit binary bytes. Characters are encoded as UTF-8, so anything beyond plain ASCII becomes multiple bytes rather than breaking.",
    howItWorks: [
      "Your text is encoded to bytes with UTF-8.",
      "Each byte is written as eight binary digits, padded with leading zeros.",
      "Bytes are separated by spaces so the output stays readable.",
    ],
    example: { input: "Hi", output: "01001000 01101001", note: "H is byte 72, i is byte 105" },
    faqs: [
      { q: "Why is one character sometimes several bytes?", a: "UTF-8 uses one byte for ASCII and two to four bytes for other characters, such as é or 😀." },
      { q: "Can I decode it again?", a: "Yes — paste the bits into the Binary to Text tool to get the original message back." },
      { q: "Is my text uploaded?", a: "No. Encoding happens in your browser and nothing leaves the page." },
    ],
    inverse: "binary-to-text",
    related: ["binary-to-text", "binary-translator", "ascii-converter", "text-to-numbers", "binary-to-decimal"],
  },
  {
    kind: "text",
    slug: "binary-to-text",
    mode: "binary-to-text",
    category: "text",
    title: "Binary to Text Converter (UTF-8 Decoder)",
    h1: "Binary to Text Converter",
    description:
      "Decode binary back into readable text. Handles UTF-8 multi-byte characters and explains clearly when the bit count is wrong.",
    intro:
      "Paste binary in groups of eight bits to recover the original message. Spaces are optional and the total bit count must be a multiple of eight.",
    howItWorks: [
      "The input is stripped of spaces and split into 8-bit bytes.",
      "Each byte is converted back into a number from 0 to 255.",
      "The byte sequence is decoded as UTF-8 into characters.",
    ],
    example: { input: "01001000 01101001", output: "Hi", note: "72 → H, 105 → i" },
    faqs: [
      { q: "Why does it say the bits are not a multiple of 8?", a: "Text is stored as whole bytes, so a partial byte cannot be decoded. Check for a missing or extra digit." },
      { q: "What if the result looks like garbage?", a: "The bytes may not be valid UTF-8, or the data may not be text at all." },
      { q: "Does spacing matter?", a: "No, spaces and line breaks are ignored." },
    ],
    inverse: "text-to-binary",
    related: ["text-to-binary", "binary-translator", "ascii-converter", "binary-to-decimal", "hex-to-binary"],
  },
  {
    kind: "text",
    slug: "binary-translator",
    mode: "text-to-binary",
    category: "text",
    title: "Binary Translator — Text ⇄ Binary",
    h1: "Binary Translator",
    description:
      "Translate between text and binary in both directions. UTF-8 accurate, instant, and free with no character limit.",
    intro:
      "A two-way binary translator: encode a message into bits or decode bits back into words. Switch direction with the swap button.",
    howItWorks: [
      "Encoding turns each character into its UTF-8 bytes and prints eight bits per byte.",
      "Decoding reverses the process, reading eight bits at a time.",
      "The translation is exact in both directions for any valid UTF-8 text.",
    ],
    example: { input: "Hi", output: "01001000 01101001", note: "Swap the panels to translate bits back into text." },
    faqs: [
      { q: "Is a binary translator the same as encryption?", a: "No. Binary is just a different way to write the same data, and anyone can read it back." },
      { q: "Can it handle emoji?", a: "Yes, thanks to UTF-8. Emoji simply use four bytes each." },
      { q: "Is there a length limit?", a: "No practical limit; translation happens locally as you type." },
    ],
    inverse: "binary-to-text",
    related: ["text-to-binary", "binary-to-text", "ascii-converter", "a1z26-cipher", "binary-to-decimal"],
  },
  {
    kind: "text",
    slug: "ascii-converter",
    mode: "text-to-ascii",
    category: "text",
    title: "ASCII Converter — Text to ASCII Codes",
    h1: "ASCII Converter",
    description:
      "Convert text to ASCII codes and ASCII codes back to text. Explains the difference between 7-bit ASCII and UTF-8 clearly.",
    intro:
      "Convert characters to their ASCII code numbers, or turn a list of codes back into text. Only the standard 7-bit range 0-127 counts as ASCII; anything else is flagged.",
    howItWorks: [
      "Each character is looked up in the ASCII table, giving a number from 0 to 127.",
      "Codes are printed separated by spaces.",
      "Decoding maps each number back to its character.",
    ],
    example: { input: "Hello", output: "72 101 108 108 111", note: "Capital H is 72; lower case letters start at 97." },
    faqs: [
      {
        q: "What is the difference between ASCII and UTF-8?",
        a: "ASCII defines 128 characters in 7 bits. UTF-8 is a superset that encodes every Unicode character in one to four bytes, and its first 128 values are identical to ASCII.",
      },
      { q: "Why is é rejected?", a: "é is not an ASCII character. Use the Text to Numbers tool, which handles the full Unicode range." },
      { q: "Is 65 always A?", a: "Yes, in both ASCII and UTF-8 the code 65 is capital A." },
    ],
    inverse: "text-to-numbers",
    related: ["text-to-binary", "binary-to-text", "text-to-numbers", "numbers-to-text", "binary-translator"],
  },
  {
    kind: "text",
    slug: "text-to-numbers",
    mode: "text-to-numbers",
    category: "text",
    title: "Text to Numbers Converter (Unicode Code Points)",
    h1: "Text to Numbers Converter",
    description:
      "Convert text into numbers using Unicode code points in decimal — a documented, reversible encoding. Free and instant.",
    intro:
      "Every character becomes its decimal Unicode code point, separated by single spaces. The encoding is explicit and fully reversible, not an invented scheme.",
    howItWorks: [
      "Each character is read as one Unicode code point, including emoji.",
      "That code point is written in decimal.",
      "Numbers are separated by single spaces so the sequence can be decoded exactly.",
    ],
    example: { input: "Hi!", output: "72 105 33", note: "H=72, i=105, !=33 — identical to ASCII for the first 128 characters." },
    faqs: [
      { q: "Which encoding is used?", a: "Decimal Unicode code points, one number per character. For letters A-Z this matches ASCII." },
      { q: "Is this A1Z26?", a: "No. A1Z26 numbers letters 1-26 and ignores the rest; use the A1Z26 tool for that." },
      { q: "Can I get the text back?", a: "Yes, the Numbers to Text tool reverses it exactly." },
    ],
    inverse: "numbers-to-text",
    related: ["numbers-to-text", "ascii-converter", "text-to-binary", "a1z26-cipher", "letter-to-number-converter"],
  },
  {
    kind: "text",
    slug: "numbers-to-text",
    mode: "numbers-to-text",
    category: "text",
    title: "Numbers to Text Converter — Decode Code Points",
    h1: "Numbers to Text Converter",
    description:
      "Turn a list of decimal Unicode code points back into readable text. Instant, exact and free in your browser.",
    intro:
      "Paste numbers separated by spaces or commas to rebuild the original text. Each number is treated as one Unicode code point.",
    howItWorks: [
      "The input is split on spaces and commas.",
      "Each number is validated as a Unicode code point (0 to 1114111).",
      "Code points are joined back into a string.",
    ],
    example: { input: "72 105 33", output: "Hi!", note: "Values above 127 decode to non-ASCII characters." },
    faqs: [
      { q: "My numbers are all 1-26 — why is the result wrong?", a: "Those are A1Z26 values, not code points. Use the Number to Letter tool instead." },
      { q: "Can I paste comma-separated values?", a: "Yes, commas and spaces are both accepted as separators." },
      { q: "What is the maximum value?", a: "1114111, the highest Unicode code point." },
    ],
    inverse: "text-to-numbers",
    related: ["text-to-numbers", "ascii-converter", "binary-to-text", "number-to-letter-converter", "a1z26-cipher"],
  },
  {
    kind: "text",
    slug: "a1z26-cipher",
    mode: "a1z26-encode",
    category: "ciphers",
    title: "A1Z26 Cipher Encoder & Decoder",
    h1: "A1Z26 Cipher",
    description:
      "Encode and decode A1Z26 messages instantly, where A=1 and Z=26. Spaces and punctuation are preserved. Free, no signup.",
    intro:
      "The A1Z26 cipher replaces each letter with its position in the alphabet: A=1, B=2, up to Z=26. Encode a whole message, or swap the panels to decode one.",
    howItWorks: [
      "Letters are matched to their alphabet position, ignoring case.",
      "Numbers within a word are separated by spaces; spaces and punctuation in the message are kept.",
      "Decoding reverses the mapping, rejecting anything outside 1-26.",
    ],
    example: { input: "HELLO", output: "8 5 12 12 15", note: "H is the 8th letter, E the 5th, L the 12th, O the 15th." },
    faqs: [
      { q: "Is A1Z26 secure?", a: "No. It is a simple substitution used in puzzles and games, not real cryptography." },
      { q: "How are word breaks shown?", a: "Spaces in the message are preserved, so words stay separated in the number sequence." },
      { q: "What about digits and punctuation?", a: "They pass through unchanged so the message stays readable." },
    ],
    inverse: "number-to-letter-converter",
    related: ["letter-to-number-converter", "number-to-letter-converter", "custom-text-encoder", "text-to-numbers", "base-26-converter"],
  },
  {
    kind: "text",
    slug: "letter-to-number-converter",
    mode: "a1z26-encode",
    category: "ciphers",
    title: "Letter to Number Converter (A=1, Z=26)",
    h1: "Letter to Number Converter",
    description:
      "Convert letters to numbers using alphabet positions where A=1 and Z=26. Works on full messages and keeps spacing intact.",
    intro:
      "Turn letters into their alphabet positions. Useful for puzzles, escape rooms, classroom exercises and quick word-value calculations.",
    howItWorks: [
      "Case is ignored, so a and A both give 1.",
      "Each letter is replaced by its 1-26 position.",
      "Non-letters are left exactly where they are.",
    ],
    example: { input: "CAB", output: "3 1 2", note: "C=3, A=1, B=2" },
    faqs: [
      { q: "What number is Z?", a: "26, the last position in the 26-letter English alphabet." },
      { q: "Can I convert a whole sentence?", a: "Yes, the whole message converts at once with spacing preserved." },
      { q: "How do I reverse it?", a: "Use the Number to Letter converter, or press swap." },
    ],
    inverse: "number-to-letter-converter",
    related: ["number-to-letter-converter", "a1z26-cipher", "text-to-numbers", "base-26-converter", "custom-text-encoder"],
  },
  {
    kind: "text",
    slug: "number-to-letter-converter",
    mode: "a1z26-decode",
    category: "ciphers",
    title: "Number to Letter Converter (1=A, 26=Z)",
    h1: "Number to Letter Converter",
    description:
      "Convert numbers back into letters with 1=A and 26=Z. Decode A1Z26 puzzles instantly, with clear errors for out-of-range values.",
    intro:
      "Paste a sequence of numbers from 1 to 26 to read the hidden word or message. Separators such as spaces, dashes and commas are handled for you.",
    howItWorks: [
      "Numbers are read one group at a time.",
      "Each value from 1 to 26 becomes the matching letter.",
      "Values outside that range are reported as an error rather than guessed.",
    ],
    example: { input: "8 5 12 12 15", output: "HELLO", note: "Each number is an alphabet position." },
    faqs: [
      { q: "Why did 27 fail?", a: "The alphabet has 26 letters, so anything above 26 has no letter to map to." },
      { q: "Are dashes supported?", a: "Yes, dashes, commas and pipes are treated as separators." },
      { q: "How do I know where words end?", a: "Spaces in the number sequence become spaces in the decoded text." },
    ],
    inverse: "letter-to-number-converter",
    related: ["letter-to-number-converter", "a1z26-cipher", "numbers-to-text", "ascii-converter", "custom-text-encoder"],
  },
];

const customBaseTool: CustomBaseTool = {
  kind: "custom-base",
  slug: "custom-bases",
  category: "other",
  title: "Custom Bases Converter — Negative & Non-Standard Bases",
  h1: "Custom Bases Converter",
  description:
    "Convert whole numbers between any integer base from -36 to -2 and 2 to 36, including experimental negative bases. Exact, instant and free.",
  intro:
    "Experiment with non-standard numerical bases. Choose any integer base from -36 to -2 or 2 to 36 for both sides. Negative bases are experimental compared with the everyday positive bases: they represent negative numbers without a minus sign. Base 0, base 1 and fractional bases are not valid and are rejected.",
  howItWorks: [
    "Your input is parsed into an exact integer using the digit set of the source base.",
    "The integer is rewritten in the target base by repeated division, keeping each remainder.",
    "For a negative base, a negative remainder is shifted up by |base| and the quotient increased by one, which is what lets negative bases encode negative values without a sign.",
  ],
  example: {
    input: "42₁₀",
    output: "101010₋₂",
    note: "Repeated division by -2 with non-negative remainders gives 1 0 1 0 1 0 read bottom-to-top.",
  },
  faqs: [
    {
      q: "What is a negative base?",
      a: "A negative base such as -2 (negabinary) uses place values that alternate in sign: 1, -2, 4, -8, 16… This lets you write both positive and negative numbers without a minus sign.",
    },
    {
      q: "Why are base 0 and base 1 rejected?",
      a: "Neither works as a positional system: base 0 has no digits at all, and base 1 cannot represent place values, so both are refused rather than silently accepted.",
    },
    {
      q: "Are fractional bases supported?",
      a: "Not in this version. Only whole-number bases from -36 to -2 and 2 to 36 are supported.",
    },
  ],
  related: ["number-base-converter", "base-26-converter", "binary-to-decimal", "hex-to-decimal"],
};

const customTools: CustomTool[] = [
  {
    kind: "custom",
    slug: "custom-text-encoder",
    category: "other",
    title: "Custom Text Encoder — Fixed Letter/Digit Substitution",
    h1: "Custom Text Encoder",
    description:
      "Encode and decode text with a fixed leetspeak-style substitution table (I→1, E→3, A→4, S→5, O→0). Free and instant in your browser.",
    intro:
      "Encode text with a fixed substitution table: I→1, Z→2, E→3, A→4, S→5, G→6, T→7, B→8 and O→0. Every other character stays as it is. This is a simple encoding and formatting tool, not encryption, and it provides no security.",
    howItWorks: [
      "Each supported letter is replaced by its fixed digit — the table cannot be changed.",
      "Type into the input panel to see the substituted text instantly.",
      "Switch to decode to turn the digits back into their letters.",
    ],
    example: { input: "BIG", output: "816", note: "B→8, I→1, G→6 using the fixed table." },
    faqs: [
      { q: "Is this encryption?", a: "No. A substitution table offers no security whatsoever — treat it as formatting or a puzzle, never as protection." },
      { q: "Can I change the mapping?", a: "No. The table is fixed so encoded text always means the same thing and decoding stays predictable." },
      { q: "Can decoding be ambiguous?", a: "Each digit maps back to exactly one letter, but digits that were already in your original text will be turned into letters when decoding." },
    ],

    related: ["a1z26-cipher", "text-to-numbers", "text-to-binary", "ascii-converter", "number-base-converter"],
  },
];

const hubs: HubTool[] = [
  {
    kind: "hub",
    slug: "binary",
    category: "base",
    title: "Binary Converters — Decimal, Hex, Text & More",
    h1: "Binary Converters",
    description: "Every binary tool in one place: binary to decimal, hex, octal and text, plus the reverse of each.",
    intro: "Binary is base 2, the language of every digital circuit. These tools convert binary in and out of the other systems you are likely to need.",
    links: ["binary-to-decimal", "decimal-to-binary", "binary-to-hex", "hex-to-binary", "text-to-binary", "binary-to-text", "binary-translator"],
    faqs: [],
    related: ["hex", "base", "text"],
  },
  {
    kind: "hub",
    slug: "hex",
    category: "base",
    title: "Hexadecimal Converters — Hex to Decimal & Binary",
    h1: "Hexadecimal Converters",
    description: "Hex converters for decimal, binary and beyond, with upper or lower case output and optional 0x prefixes.",
    intro: "Hexadecimal packs four bits into one digit, which is why it appears everywhere from colour codes to memory dumps.",
    links: ["hex-to-decimal", "decimal-to-hex", "hex-to-binary", "binary-to-hex", "number-base-converter"],
    faqs: [],
    related: ["binary", "base", "text"],
  },
  {
    kind: "hub",
    slug: "base",
    category: "base",
    title: "Number Base Converters — Base 2 to Base 62",
    h1: "Number Base Converters",
    description: "Convert between any bases from 2 to 62, including octal, base 26, base 32, base 36, base 58 and base 62.",
    intro: "Pick any pair of positional number systems and convert exactly, at any size, using arbitrary-precision arithmetic.",
    links: ["number-base-converter", "octal-to-decimal", "decimal-to-octal", "base-26-converter", "binary-to-decimal", "hex-to-decimal"],
    faqs: [],
    related: ["binary", "hex", "ciphers"],
  },
  {
    kind: "hub",
    slug: "text",
    category: "text",
    title: "Text & ASCII Converters — Binary, Codes, Unicode",
    h1: "Text & ASCII Converters",
    description: "Convert text to binary, ASCII codes or Unicode numbers, and decode all of them back into readable text.",
    intro: "These tools move between human-readable text and the numbers computers actually store, with UTF-8 handled correctly throughout.",
    links: ["text-to-binary", "binary-to-text", "binary-translator", "ascii-converter", "text-to-numbers", "numbers-to-text"],
    faqs: [],
    related: ["binary", "ciphers", "base"],
  },
  {
    kind: "hub",
    slug: "ciphers",
    category: "ciphers",
    title: "Cipher & Encoding Tools — A1Z26 and Custom Maps",
    h1: "Cipher & Encoding Tools",
    description: "A1Z26 encoding, letter-number conversion and a custom substitution encoder. For puzzles, not security.",
    intro: "Simple, transparent letter encodings for puzzles, teaching and games. None of these provide security or real cryptography.",
    links: ["a1z26-cipher", "letter-to-number-converter", "number-to-letter-converter", "custom-text-encoder"],
    faqs: [],
    related: ["text", "base"],
  },
];

export const TOOLS: Record<string, Tool> = Object.fromEntries(
  [...numberTools, ...textTools, ...customTools, customBaseTool, ...hubs].map((t) => [t.slug, t as Tool]),
);

export const NUMBER_TOOLS = numberTools;
export const TEXT_TOOLS = textTools;
export const CIPHER_TOOLS = textTools.filter((t) => t.category === "ciphers");
export const HUBS = hubs;
export const OTHER_TOOLS = [...customTools, customBaseTool];
export const CUSTOM_BASE_TOOL = customBaseTool;

export function getTool(slug: string): Tool | undefined {
  return TOOLS[slug];
}
