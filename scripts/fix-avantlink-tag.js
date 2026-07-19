/**
 * AvantLink's affiliate verification crawler does a literal string match for the
 * <script> tag it issues. React escapes `&` to `&amp;` in attribute values, which
 * is valid HTML (browsers decode it and the script loads fine) but does not match
 * the tag AvantLink issued, so verification fails.
 *
 * This rewrites the escaped ampersand back to a literal `&` in the built HTML so
 * the served bytes match the issued tag exactly. Scoped to the AvantLink URL only.
 *
 * Safe to remove once the affiliate application is verified.
 */
const fs = require("fs")
const path = require("path")

const PUBLIC_DIR = path.join(__dirname, "..", "public")
const ESCAPED = "affiliate_app_confirm.php?mode=js&amp;authResponse="
const LITERAL = "affiliate_app_confirm.php?mode=js&authResponse="

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(full)
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : []
  })
}

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error(`fix-avantlink-tag: ${PUBLIC_DIR} not found, run gatsby build first`)
  process.exit(1)
}

let patched = 0
for (const file of htmlFiles(PUBLIC_DIR)) {
  const source = fs.readFileSync(file, "utf8")
  if (!source.includes(ESCAPED)) continue
  fs.writeFileSync(file, source.split(ESCAPED).join(LITERAL))
  console.log(`fix-avantlink-tag: patched ${path.relative(PUBLIC_DIR, file)}`)
  patched++
}

if (patched === 0) {
  console.warn("fix-avantlink-tag: no files patched (tag missing or already literal)")
}
