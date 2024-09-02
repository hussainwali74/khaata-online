"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useAuth,
  UserButton,
  SignInButton,
  SignUpButton,
  ClerkLoading,
  ClerkLoaded,
  SignedOut,
  SignedIn,
} from "@clerk/nextjs";
import { Home, Users, Package, FileText, Settings, Loader, Settings2 } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/invoices", label: "Invoices", icon: FileText },
];

interface AdminNavbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function AdminNavbar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Khata App
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center pt-1 space-x-4  ">
            <Link href="/settings">
              <Settings2 className="w-5 h-5 text-muted-foreground hover:text-gray-700 hover:cursor-pointer " />
            </Link>
            <ClerkLoading>
              <Loader className="w-5 h-5 text-muted-foreground animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <div className="flex space-x-2 items-center ">
                <SignedOut>
                  <SignInButton
                    mode="modal"
                    fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
                  >
                    <Button variant={"primaryOutline"} size={"sm"} className="w-full">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton
                    mode="modal"
                    fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
                  >
                    <Button variant={"ghost-primary"} size={"sm"} className="w-full">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </nav>
  );
}
