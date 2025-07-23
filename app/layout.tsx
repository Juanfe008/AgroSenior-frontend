// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "./utils/AuthProvider";
import localFont from "next/font/local";
import "./globals.css";
import { SettingsProvider } from './contexts/SettingsContext';
import ThemeWrapper from "./components/ThemeWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isResetPassword = pathname === "/ResetPassword";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <SettingsProvider>
          <ThemeWrapper>
            {isHome || isResetPassword ? children : <AuthProvider>{children}</AuthProvider>}
          </ThemeWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}