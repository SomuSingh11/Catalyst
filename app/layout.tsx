import type { Metadata } from "next";
import { Inter, Source_Code_Pro, Figtree } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Providers from "@/Providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catalyst",
  description: "Catalyst by k4ge",
  icons: {
    icon: "/binaryIcon.svg",
  },
};

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree", // Set the CSS variable name
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            `${inter.variable} ${sourceCodePro.variable} ${figtree.variable} antialiased`,
            `min-h-screen flex flex-col`
          )}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
