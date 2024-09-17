import { AdminNavbar } from "@/components/AdminNavbar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@clerk/nextjs/server";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  return (
    <>
      <div className="hidden md:block">
        <AdminNavbar />
      </div>
      <div className="md:hidden sm:block">
        <MobileNavbar />
      </div>
      <main className={userId ? "pt-2 lg:pt-1 mb-2 lg:mt-16  lg:mb-0 container mx-auto" : ""}>{children}</main>
      <Toaster />
    </>
  );
}
