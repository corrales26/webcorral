import sharp from "sharp";

const MAX_EDGE = 1920;
const WEBP_QUALITY = 78;

export async function optimizePropertyImage(input: Buffer): Promise<Buffer> {
  return sharp(input, { failOn: "none", animated: false })
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}
