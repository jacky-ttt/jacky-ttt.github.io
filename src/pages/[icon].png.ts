import type { APIRoute, GetStaticPaths } from "astro"
import { png } from "../images/favicon"

// Home-screen icons: apple-touch-icon in Layout.astro, the Android ones in manifest.webmanifest.
export const getStaticPaths = (() => [
  { params: { icon: "apple-touch-icon" }, props: { size: 180 } },
  { params: { icon: "android-chrome-192x192" }, props: { size: 192 } },
  { params: { icon: "android-chrome-512x512" }, props: { size: 512 } },
]) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) =>
  new Response(await png(props.size, { fullBleed: true }), {
    headers: { "Content-Type": "image/png" },
  })
