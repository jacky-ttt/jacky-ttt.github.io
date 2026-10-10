import { png } from "../images/favicon"

// An ICO file is a small directory followed by the images; modern ICOs embed PNGs as-is.
export const GET = async () => {
  const sizes = [16, 32, 48]
  const images = await Promise.all(sizes.map((size) => png(size)))
  const header = new DataView(new ArrayBuffer(6 + 16 * sizes.length))
  header.setUint16(2, 1, true) // type: icon
  header.setUint16(4, sizes.length, true)
  let offset = header.byteLength
  sizes.forEach((size, i) => {
    const entry = 6 + 16 * i
    header.setUint8(entry, size) // width
    header.setUint8(entry + 1, size) // height
    header.setUint16(entry + 4, 1, true) // colour planes
    header.setUint16(entry + 6, 32, true) // bits per pixel
    header.setUint32(entry + 8, images[i].length, true)
    header.setUint32(entry + 12, offset, true)
    offset += images[i].length
  })
  return new Response(new Blob([header, ...images]), {
    headers: { "Content-Type": "image/x-icon" },
  })
}
