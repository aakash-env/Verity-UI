import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verity - UI blocks you can bench",
  description:
    "Confirms aren't dialogs. They're how you don't lose the customer's data — or their money. 8 production confirmation interactions for React apps.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/icon.svg",
  },
  keywords: [
    "react",
    "confirmation dialog",
    "ui component",
    "hold to confirm",
    "slide to delete",
    "type to confirm",
    "nextjs",
    "design engineering",
  ],
  authors: [{ name: "Verity" }],
  openGraph: {
    title: "Verity — High-Stakes Confirmation Interactions for React",
    description:
      "Confirms aren't dialogs. They're how you don't lose the customer's data — or their money.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verity — High-Stakes Confirmation Interactions for React",
    description:
      "Confirms aren't dialogs. They're how you don't lose the customer's data — or their money.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
