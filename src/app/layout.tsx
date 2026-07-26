import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Syne (extra bold) for main headings.
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-syne",
});

// Space Grotesk for body copy + metadata.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Rami Nawahda — Software Engineer",
  description:
    "Full-stack engineer specialized in Angular & TypeScript, building end-to-end production systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Applies the saved theme before first paint to avoid a flash. Defaults to
  // light; only an explicit saved "dark" choice enables dark mode.
  const noFlashScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
