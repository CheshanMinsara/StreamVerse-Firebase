import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "StreamVerse",
  description: "Your universe of free movies and TV series.",
  icons: [{
    rel: 'icon',
    url: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>`
  }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <div className="relative flex min-h-screen w-full flex-col">
          <div className="w-full bg-yellow-500 text-black p-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
            <Megaphone className="h-5 w-5" />
            <span>This website is for sale! Contact cheshanminsara@gmail.com for inquiries.</span>
          </div>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
