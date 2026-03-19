"use client";

const CP1252_REVERSE_MAP: Record<string, number> = {
  "€": 0x80,
  "‚": 0x82,
  "ƒ": 0x83,
  "„": 0x84,
  "…": 0x85,
  "†": 0x86,
  "‡": 0x87,
  "ˆ": 0x88,
  "‰": 0x89,
  "Š": 0x8a,
  "‹": 0x8b,
  "Œ": 0x8c,
  "Ž": 0x8e,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "•": 0x95,
  "–": 0x96,
  "—": 0x97,
  "˜": 0x98,
  "™": 0x99,
  "š": 0x9a,
  "›": 0x9b,
  "œ": 0x9c,
  "ž": 0x9e,
  "Ÿ": 0x9f,
};

function toCp1252Byte(char: string) {
  const code = char.charCodeAt(0);

  if (code <= 0xff) {
    return code;
  }

  return CP1252_REVERSE_MAP[char];
}

export function fixUtf8Mojibake(input: string) {
  if (!input.includes("â")) {
    return input;
  }

  const bytes: number[] = [];

  for (const char of input) {
    const byte = toCp1252Byte(char);

    if (byte === undefined) {
      return input;
    }

    bytes.push(byte);
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      new Uint8Array(bytes),
    );
  } catch {
    return input;
  }
}
