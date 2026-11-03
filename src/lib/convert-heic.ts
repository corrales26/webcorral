import convert from "heic-convert";

const HEIC_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "heif",
  "mif1",
  "msf1",
]);

export function isHeicBuffer(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  if (buffer.subarray(4, 8).toString("ascii") !== "ftyp") return false;
  return HEIC_BRANDS.has(buffer.subarray(8, 12).toString("ascii"));
}

export async function convertHeicToJpeg(buffer: Buffer): Promise<Buffer> {
  const jpeg = await convert({
    buffer,
    format: "JPEG",
    quality: 0.92,
  });
  return Buffer.from(jpeg);
}
