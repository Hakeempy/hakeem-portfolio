import type { Metadata } from "next";
import { site } from "@/data/site";
import { InlineScript, themeScript } from "@/components/theme/InlineScript";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <InlineScript html={themeScript} />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap"
        />
      </head>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
