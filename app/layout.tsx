import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSphere",
  description: "Course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
