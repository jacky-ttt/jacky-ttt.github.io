import sharp from "sharp"
import svg from "./favicon.svg?raw"

// favicon.svg is the only icon source; every other icon is rendered from it at build time
// (src/pages/favicon.*.ts and [icon].png.ts).
export { svg }

/** Renders the icon as a PNG. Home-screen icons are full-bleed: iOS and Android round the corners. */
export const png = async (size: number, { fullBleed = false } = {}) =>
  new Uint8Array(
    await sharp(Buffer.from(fullBleed ? svg.replace(' rx="7"', "") : svg), {
      density: (72 * size) / 32, // the SVG is 32 units wide; render at the target size, not upscaled
    })
      .resize(size, size)
      .png()
      .toBuffer(),
  )
