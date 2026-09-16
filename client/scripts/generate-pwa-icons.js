import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// CRC32 table
function makeCRCTable() {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}
const crcTable = makeCRCTable();
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Polygon approximation of the ICSN ribbon logo (coordinates mapped in 0..48 x 0..46 space)
const logoPolygon = [
  [25.95, 44.94],
  [23.92, 44.24],
  [23.92, 33.94],
  [21.66, 31.68],
  [10.29, 31.68],
  [9.37, 29.89],
  [16.85, 19.42],
  [15.01, 15.84],
  [1.24, 15.84],
  [0.32, 14.05],
  [10.01, 0.47],
  [10.93, 0.00],
  [39.83, 0.00],
  [40.75, 1.79],
  [33.27, 12.26],
  [35.11, 15.84],
  [46.49, 15.84],
  [47.38, 17.67],
  [25.95, 44.94]
];

function isInsidePolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Signed distance to squircle (rounded rectangle)
function sdRoundedRect(x, y, halfW, halfH, r) {
  const dx = Math.abs(x) - halfW + r;
  const dy = Math.abs(y) - halfH + r;
  const outerDist = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  const innerDist = Math.min(Math.max(dx, dy), 0);
  return outerDist + innerDist - r;
}

function generateIcon(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;

  // Squircle parameters for standard icon
  const halfW = width * 0.44;
  const halfH = height * 0.44;
  const radius = width * 0.22;

  // Scaling factor to fit logo in center
  // Logo bounding box is 48 x 46
  const targetLogoSize = isMaskable ? width * 0.52 : width * 0.56;
  const logoScale = targetLogoSize / 48;
  const logoOffsetX = cx - (24 * logoScale);
  const logoOffsetY = cy - (23 * logoScale);

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      // 2x2 supersampling for crisp antialiasing
      let accR = 0, accG = 0, accB = 0, accA = 0;

      const subSamples = [
        [0.25, 0.25],
        [0.75, 0.25],
        [0.25, 0.75],
        [0.75, 0.75]
      ];

      for (const [sx, sy] of subSamples) {
        const px = x + sx;
        const py = y + sy;
        const distToCenter = Math.hypot(px - cx, py - cy);

        let r = 0, g = 0, b = 0, a = 0;

        // 1. Container Background
        if (isMaskable) {
          // Full bleed dark gradient background for maskable adaptive icons
          const ny = py / height;
          const nx = px / width;
          // Gradient from top-left deep navy #0f172a to bottom-right obsidian #07090e
          r = Math.round(15 * (1 - ny) + 7 * ny);
          g = Math.round(23 * (1 - ny) + 9 * ny);
          b = Math.round(42 * (1 - ny) + 14 * ny);
          a = 255;

          // Ambient radial purple glow behind logo
          const glow = Math.max(0, 1 - (distToCenter / (width * 0.42)));
          if (glow > 0) {
            r = Math.min(255, r + Math.round(134 * glow * 0.35));
            g = Math.min(255, g + Math.round(59 * glow * 0.35));
            b = Math.min(255, b + Math.round(255 * glow * 0.35));
          }
        } else {
          // Rounded squircle container
          const sd = sdRoundedRect(px - cx, py - cy, halfW, halfH, radius);
          
          if (sd <= 0) {
            // Inside squircle
            const edgeDist = -sd;
            const ny = (py - (cy - halfH)) / (halfH * 2);
            
            // Base metallic obsidian/slate gradient
            r = Math.round(16 * (1 - ny) + 9 * ny);
            g = Math.round(24 * (1 - ny) + 12 * ny);
            b = Math.round(44 * (1 - ny) + 20 * ny);
            a = 255;

            // Subtle 1px inner border highlight
            if (edgeDist < 1.5) {
              const borderAlpha = (1.5 - edgeDist) / 1.5;
              const borderGrad = 1 - ny;
              r = Math.round(r * (1 - borderAlpha) + (134 * borderGrad + 70 * (1 - borderGrad)) * borderAlpha);
              g = Math.round(g * (1 - borderAlpha) + (90 * borderGrad + 120 * (1 - borderGrad)) * borderAlpha);
              b = Math.round(b * (1 - borderAlpha) + 255 * borderAlpha);
            }

            // Radial ambient purple/cyan aura
            const glow = Math.max(0, 1 - (distToCenter / (width * 0.40)));
            if (glow > 0) {
              const gP = glow * glow;
              r = Math.min(255, r + Math.round(120 * gP));
              g = Math.min(255, g + Math.round(50 * gP));
              b = Math.min(255, b + Math.round(230 * gP));
            }
          } else if (sd < 1.0) {
            // Antialiased outer edge of squircle
            const alpha = 1.0 - sd;
            r = 15; g = 23; b = 42;
            a = Math.round(255 * alpha);
          }
        }

        // 2. ICSN Ribbon Logo Render
        const lx = (px - logoOffsetX) / logoScale;
        const ly = (py - logoOffsetY) / logoScale;

        if (lx >= 0 && lx <= 48 && ly >= 0 && ly <= 46) {
          if (isInsidePolygon(lx, ly, logoPolygon)) {
            // Gradient mapping across the ribbon
            const tX = lx / 48;
            const tY = ly / 46;
            const t = (tX * 0.6 + tY * 0.4);

            // Brand Gradient: Electric Violet (#863bff) -> Vivid Cyan (#38bdf8) -> Magenta highlight
            let lr, lg, lb;
            if (t < 0.5) {
              const k = t / 0.5;
              lr = Math.round(134 * (1 - k) + 99 * k);
              lg = Math.round(59 * (1 - k) + 102 * k);
              lb = Math.round(255 * (1 - k) + 241 * k);
            } else {
              const k = (t - 0.5) / 0.5;
              lr = Math.round(99 * (1 - k) + 56 * k);
              lg = Math.round(102 * (1 - k) + 189 * k);
              lb = Math.round(241 * (1 - k) + 248 * k);
            }

            // Specular glass shine (diagonal light stripe across top)
            const shineDist = Math.abs((lx * 0.9 - ly * 1.1) - 4);
            if (shineDist < 5) {
              const shineIntensity = (1 - (shineDist / 5)) * 0.35;
              lr = Math.min(255, Math.round(lr + 255 * shineIntensity));
              lg = Math.min(255, Math.round(lg + 255 * shineIntensity));
              lb = Math.min(255, Math.round(lb + 255 * shineIntensity));
            }

            // Blend logo over background
            r = lr;
            g = lg;
            b = lb;
            a = 255;
          }
        }

        accR += r;
        accG += g;
        accB += b;
        accA += a;
      }

      rawData[offset++] = Math.round(accR / 4);
      rawData[offset++] = Math.round(accG / 4);
      rawData[offset++] = Math.round(accB / 4);
      rawData[offset++] = Math.round(accA / 4);
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const icons = [
  { name: 'pwa-64x64.png', size: 64, maskable: false },
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'maskable-icon-512x512.png', size: 512, maskable: true },
];

for (const icon of icons) {
  const buf = generateIcon(icon.size, icon.size, icon.maskable);
  const target = path.join(publicDir, icon.name);
  fs.writeFileSync(target, buf);
  console.log(`Generated high-res ${icon.name} (${buf.length} bytes)`);
}

console.log('All improved PWA icons successfully generated!');
