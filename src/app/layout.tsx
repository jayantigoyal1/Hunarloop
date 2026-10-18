import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { PlatformPreferences } from "@/components/platform-preferences";

export const metadata: Metadata = {
  title: "HunarLoop | Your skills, your future",
  description: "A voice-first career journey for every learner.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <PlatformPreferences><AppShell>{children}</AppShell></PlatformPreferences>
      </body>
    </html>
  );
}
