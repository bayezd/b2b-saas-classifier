import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "B2B SaaS Classifier",
  description: "Classify B2B companies with AI precision",
  keywords: [
    "B2B",
    "SaaS",
    "AI",
    "Classification",
    "Company Analysis",
    "Business Intelligence",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <SupabaseProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
