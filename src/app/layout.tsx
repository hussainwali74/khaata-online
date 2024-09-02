import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { AdminNavbar } from "@/components/AdminNavbar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { auth } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khata App",
  description: "Accounts management app for small businesses",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <>
            <div className="hidden md:block">
              <AdminNavbar />
            </div>
              <div className="md:hidden sm:block">
                <MobileNavbar />
              </div>
          </>
          <main className={userId ? "pt-2 lg:pt-16 mb-2  lg:mb-0 container mx-auto" : ""}>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
