import type { Metadata } from "next"
import { Hanken_Grotesk } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: "variable",
})

export const metadata: Metadata = {
  title: "Lead Desk",
  description: "Research, call and track leads.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      {/* Browser extensions (e.g. colour pickers) add attributes to <body>
          before React loads; don't report those as hydration errors. */}
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
