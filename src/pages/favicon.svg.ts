import { svg } from "../images/favicon"

export const GET = () =>
  new Response(svg, { headers: { "Content-Type": "image/svg+xml" } })
