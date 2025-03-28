import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieNight - Plan your perfect movie night",
  description:
    "Plan the perfect movie night with friends! Propose movies, vote for your favorites, and let everyone contribute to deciding what to watch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <footer className="py-4 text-center text-sm text-muted-foreground border-t">
              Created by{" "}
              <Link
                href="https://github.com/Dyotson"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary underline underline-offset-4"
              >
                Dyotson
              </Link>
            </footer>
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
