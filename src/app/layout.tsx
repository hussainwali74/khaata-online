import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khata App",
  description: "Accounts management app for small businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-col h-[calc(100vh-4rem)] mt-20 lg:mt-0">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
