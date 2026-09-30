import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The dev badge defaults to bottom-left, on top of the filter rail.
  devIndicators: { position: "bottom-right" },
  // Demo sites carry real practices' names: keep them out of search results.
  // Also set in each page's metadata; the header covers non-HTML responses.
  async headers() {
    return [{ source: "/demo/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
  },
}

export default nextConfig
