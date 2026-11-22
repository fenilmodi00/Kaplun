import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Providers } from "@/components/ui/Providers";
import "./globals.css";

// cerebras.ai sets Manrope for headings and body, Sometype Mono for code. IBM Plex Mono is the shipped mono (Sometype Mono is not on next/font).
const chunky = Manrope({ subsets: ["latin"], variable: "--font-chunky", weight: ["500", "600", "700"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono-face", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "Kaplun", template: "%s · Kaplun" },
  description: "Kaplun. Show Kimi K3.1 Pro any machine and see every part inside it in 3D, with drawings, a step-by-step teardown and a quiz.",
};

// Cerebras.com is dark. Dark is the default unless a light preference was saved.
const themeScript = `try{var t=localStorage.getItem("kaplun-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${chunky.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
