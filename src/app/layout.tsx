import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { PlatformPreferences } from "@/components/platform-preferences";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "HunarLoop | Your skills, your future",
  description: "A voice-first career journey for every learner.",
  manifest: "/manifest.json",
  icons: { icon: [{ url: "/icons/hunarloop.svg", type: "image/svg+xml" }, { url: "/icons/hunarloop-192.png", sizes: "192x192", type: "image/png" }], apple: "/icons/hunarloop-192.png" },
};

export const viewport: Viewport = { themeColor: "#285744" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <PwaRegister /><PlatformPreferences><AppShell>{children}</AppShell></PlatformPreferences>
      </body>
    </html>
  );
}
