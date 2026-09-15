/* One-off generator for public/og-image.png (1200x630).
 * Flat single-colour background - no gradients. No dependencies. */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const W = 1200;
const H = 630;
const BG = [79, 70, 229]; // brand-600 (#4f46e5)
const FG = [255, 255, 255];
const px = new Uint8Array(W * H * 3);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    px[i] = BG[0];
    px[i + 1] = BG[1];
    px[i + 2] = BG[2];
  }
}

const setPixel = (x, y, [r, g, b]) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
};

// 5x7 bitmap font (only the glyphs used on the card)
const FONT = {
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  " ": [0, 0, 0, 0, 0, 0, 0],
};

const textWidth = (text, scale) => (text.length * 6 - 1) * scale;

const drawText = (text, scale, top, color) => {
  let cursor = Math.round((W - textWidth(text, scale)) / 2);
  for (const char of text) {
    const glyph = FONT[char] ?? FONT[" "];
    glyph.forEach((row, rowIndex) => {
      for (let col = 0; col < 5; col++) {
        if (row & (1 << (4 - col))) {
          for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) {
              setPixel(cursor + col * scale + dx, top + rowIndex * scale + dy, color);
            }
          }
        }
      }
    });
    cursor += 6 * scale;
  }
};

const LINE_1 = "UAF NOTES";
const LINE_2 = "SHARING APP";
const SCALE_1 = 16;
const SCALE_2 = 9;
const GAP = 48;
const blockHeight = 7 * SCALE_1 + 7 * SCALE_2 + GAP;
const top = Math.round((H - blockHeight) / 2);

drawText(LINE_1, SCALE_1, top, FG);
drawText(LINE_2, SCALE_2, top + 7 * SCALE_1 + GAP, FG);

// ---- PNG encoding -------------------------------------------------------
const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 2;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  const rowStart = y * (1 + W * 3);
  raw[rowStart] = 0;
  Buffer.from(px.buffer, y * W * 3, W * 3).copy(raw, rowStart + 1);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync("public/og-image.png", png);
console.log(`Wrote public/og-image.png (${W}x${H}, ${png.length} bytes)`);
