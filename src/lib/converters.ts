export type ConverterFaq = { q: string; a: string };

export type ConverterDef = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  fromBase: number;
  toBase: number;
  fromLabel: string;
  toLabel: string;
  placeholder: string;
  intro: string;
  howItWorks: string[];
  example: { input: string; output: string; note: string };
  faqs: ConverterFaq[];
  inverse: string;
};

export const CONVERTERS: Record<string, ConverterDef> = {
  "binary-to-decimal": {
    slug: "binary-to-decimal",
    title: "Binary to Decimal Converter — Instant & Free",
    h1: "Binary to Decimal Converter",
    description:
      "Convert binary to decimal instantly. Paste any binary number, get the decimal value plus step-by-step working. Free, runs in your browser.",
    fromBase: 2,
    toBase: 10,
    fromLabel: "Binary",
    toLabel: "Decimal",
    placeholder: "1011 0110",
    intro:
      "Enter a binary number (only 0s and 1s) and get the decimal value immediately. Spaces, underscores and a leading 0b are ignored, and arbitrarily long numbers stay exact.",
    howItWorks: [
      "Binary is base 2: each digit position is worth twice the position to its right, starting at 1 on the far right.",
      "Multiply every digit by its place value and add the products together.",
      "The sum is the decimal (base 10) equivalent.",
    ],
    example: {
      input: "10110110",
      output: "182",
      note: "128 + 0 + 32 + 16 + 0 + 4 + 2 + 0 = 182",
    },
    faqs: [
      {
        q: "How do I convert binary to decimal by hand?",
        a: "Write the place values 1, 2, 4, 8, 16... under the binary digits from right to left, then add the place values wherever the digit is 1.",
      },
      {
        q: "What is 1111 1111 in decimal?",
        a: "255. Eight 1-bits is the largest value a single byte can hold, and is why 255 shows up so often in colour codes and network masks.",
      },
      {
        q: "Can this handle very large binary numbers?",
        a: "Yes. The converter uses arbitrary-precision arithmetic, so hundreds of bits convert exactly with no rounding.",
      },
      {
        q: "Is my input sent anywhere?",
        a: "No. Every conversion runs locally in your browser; nothing is uploaded or stored.",
      },
    ],
    inverse: "decimal-to-binary",
  },
  "decimal-to-binary": {
    slug: "decimal-to-binary",
    title: "Decimal to Binary Converter — Free Online Tool",
    h1: "Decimal to Binary Converter",
    description:
      "Turn any decimal number into binary in one step. Shows the division-by-2 working so you can check every remainder. Free, no signup.",
    fromBase: 10,
    toBase: 2,
    fromLabel: "Decimal",
    toLabel: "Binary",
    placeholder: "182",
    intro:
      "Type a decimal (base 10) number to see its binary form instantly. The step-by-step panel shows the division-by-2 method used in classrooms and exams.",
    howItWorks: [
      "Divide the decimal number by 2 and note the remainder (0 or 1).",
      "Divide the quotient by 2 again, and keep going until the quotient reaches 0.",
      "Read the remainders from the last one to the first — that is the binary number.",
    ],
    example: {
      input: "182",
      output: "10110110",
      note: "182/2=91 r0, 91/2=45 r1, 45/2=22 r1, 22/2=11 r0, 11/2=5 r1, 5/2=2 r1, 2/2=1 r0, 1/2=0 r1",
    },
    faqs: [
      {
        q: "What is 100 in binary?",
        a: "1100100. You can check it here by typing 100 into the box above.",
      },
      {
        q: "Why does binary only use 0 and 1?",
        a: "Digital circuits store two reliable states — off and on — so base 2 maps directly onto the hardware.",
      },
      {
        q: "Does it work with negative numbers?",
        a: "Yes. A minus sign is preserved, so -10 converts to -1010. Two's complement representation is not applied.",
      },
      {
        q: "Is there a limit on the number size?",
        a: "No practical limit. Arbitrary-precision arithmetic keeps very large numbers exact.",
      },
    ],
    inverse: "binary-to-decimal",
  },
  "hex-to-decimal": {
    slug: "hex-to-decimal",
    title: "Hex to Decimal Converter — Fast & Free",
    h1: "Hex to Decimal Converter",
    description:
      "Convert hexadecimal to decimal instantly. Handles upper and lower case, 0x prefixes and very long values, with the place-value maths shown.",
    fromBase: 16,
    toBase: 10,
    fromLabel: "Hexadecimal",
    toLabel: "Decimal",
    placeholder: "B6",
    intro:
      "Paste a hex value — upper case, lower case, with or without a 0x prefix — and read off the decimal equivalent straight away.",
    howItWorks: [
      "Hexadecimal is base 16, using the digits 0-9 then A-F for the values 10-15.",
      "Each position is worth 16 times the position to its right: 1, 16, 256, 4096 and so on.",
      "Multiply each digit by its place value and add the results to get decimal.",
    ],
    example: {
      input: "B6",
      output: "182",
      note: "B = 11, so 11 x 16 + 6 x 1 = 176 + 6 = 182",
    },
    faqs: [
      {
        q: "Does case matter in hex?",
        a: "No. FF and ff are the same value, and this converter accepts either.",
      },
      {
        q: "What does the 0x prefix mean?",
        a: "It is a programming convention marking a literal as hexadecimal. You can leave it in — the converter strips it automatically.",
      },
      {
        q: "What is FF in decimal?",
        a: "255, the maximum value of one byte and the maximum intensity of a colour channel in a hex colour code.",
      },
      {
        q: "Can I convert a colour code like #1A2B3C?",
        a: "Yes, drop the # and convert each two-digit pair separately for the red, green and blue values.",
      },
    ],
    inverse: "decimal-to-hex",
  },
  "decimal-to-hex": {
    slug: "decimal-to-hex",
    title: "Decimal to Hex Converter — Free Online",
    h1: "Decimal to Hex Converter",
    description:
      "Convert decimal numbers to hexadecimal instantly, with optional uppercase output, a 0x prefix and full step-by-step working.",
    fromBase: 10,
    toBase: 16,
    fromLabel: "Decimal",
    toLabel: "Hexadecimal",
    placeholder: "182",
    intro:
      "Enter a decimal number to get its hexadecimal form. Toggle uppercase output or the 0x prefix to match your code style.",
    howItWorks: [
      "Divide the decimal number by 16 and record the remainder.",
      "Convert remainders 10-15 to the letters A-F.",
      "Repeat with each quotient until it reaches 0, then read the remainders bottom-to-top.",
    ],
    example: {
      input: "182",
      output: "b6",
      note: "182/16 = 11 remainder 6, and 11 is written as B, giving B6",
    },
    faqs: [
      {
        q: "Should hex be uppercase or lowercase?",
        a: "Both are valid. Uppercase is common in documentation and colour codes; lowercase is common in C-style source. Use the toggle above.",
      },
      {
        q: "What is 255 in hex?",
        a: "FF. It is the largest value that fits in two hex digits, or one byte.",
      },
      {
        q: "Why do programmers use hexadecimal?",
        a: "One hex digit maps exactly to four binary bits, so hex writes binary data compactly without losing the bit structure.",
      },
      {
        q: "Does the converter round large numbers?",
        a: "No. Arbitrary-precision arithmetic means even hundred-digit numbers convert exactly.",
      },
    ],
    inverse: "hex-to-decimal",
  },
  "binary-to-hex": {
    slug: "binary-to-hex",
    title: "Binary to Hex Converter — Instant Results",
    h1: "Binary to Hex Converter",
    description:
      "Convert binary to hexadecimal in one step. Groups bits into nibbles, shows how each hex digit is formed, and copies with one click.",
    fromBase: 2,
    toBase: 16,
    fromLabel: "Binary",
    toLabel: "Hexadecimal",
    placeholder: "10110110",
    intro:
      "Paste binary digits and get the hexadecimal value instantly. Spaces between bytes are fine — they are ignored.",
    howItWorks: [
      "Split the binary number into groups of four bits, starting from the right.",
      "Pad the leftmost group with leading zeros if it has fewer than four bits.",
      "Replace each four-bit group with its single hex digit, 0000 to 1111 becoming 0 to F.",
    ],
    example: {
      input: "10110110",
      output: "b6",
      note: "1011 = B and 0110 = 6, so the result is B6",
    },
    faqs: [
      {
        q: "Why is binary to hex so direct?",
        a: "16 is 2 to the power of 4, so every four bits map onto exactly one hex digit with no arithmetic needed.",
      },
      {
        q: "Do I need to pad my binary to a multiple of four?",
        a: "No. The converter handles any length and pads internally.",
      },
      {
        q: "What is 1111 1111 in hex?",
        a: "FF, which is 255 in decimal.",
      },
      {
        q: "Are spaces in my input a problem?",
        a: "No. Spaces, underscores and a leading 0b are stripped before conversion.",
      },
    ],
    inverse: "hex-to-binary",
  },
  "hex-to-binary": {
    slug: "hex-to-binary",
    title: "Hex to Binary Converter — Free Online Tool",
    h1: "Hex to Binary Converter",
    description:
      "Convert hex to binary instantly, with per-digit expansion, one-click copy and support for upper or lower case input.",
    fromBase: 16,
    toBase: 2,
    fromLabel: "Hexadecimal",
    toLabel: "Binary",
    placeholder: "B6",
    intro:
      "Enter a hexadecimal value in any case to see its binary expansion. Useful for reading bit flags, masks and register values.",
    howItWorks: [
      "Take each hex digit on its own, from left to right.",
      "Write that digit as a four-bit binary group: 0 is 0000, 9 is 1001, F is 1111.",
      "Join the groups together in order to get the full binary number.",
    ],
    example: {
      input: "B6",
      output: "10110110",
      note: "B = 1011 and 6 = 0110, joined gives 10110110",
    },
    faqs: [
      {
        q: "How many bits is one hex digit?",
        a: "Exactly four. Two hex digits make one 8-bit byte.",
      },
      {
        q: "Does the result keep leading zeros?",
        a: "Leading zeros are trimmed from the final number. Pad the output yourself if you need a fixed bit width.",
      },
      {
        q: "Can I paste a 0x prefixed value?",
        a: "Yes, the 0x prefix is detected and removed automatically.",
      },
      {
        q: "What is FF in binary?",
        a: "11111111 — eight bits all set to 1.",
      },
    ],
    inverse: "binary-to-hex",
  },
};

export const CONVERTER_LIST = Object.values(CONVERTERS);
