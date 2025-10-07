import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/ui/ToastProvider";
import RouteGuard from "@/components/auth/RouteGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remortify",
  description: "Streamline your remote work with Remortify - the all-in-one platform for team collaboration, project management, and productivity.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16" },
      { url: "/remote_logo.png", type: "image/png", sizes: "32x32" }
    ],
    shortcut: "/favicon.ico",
    apple: "/remote_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="16x16" type="image/x-icon" />
        <link rel="icon" href="/remote_logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/remote_logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <RouteGuard>
              {children}
            </RouteGuard>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
