import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Khata App
          </Link>
          <div className="space-x-4">
            <Link href="/customers" passHref>
              <Button variant="ghost">Customers</Button>
            </Link>
            <Link href="/invoices" passHref>
              <Button variant="ghost">Invoices</Button>
            </Link>
            <Link href="/products" passHref>
              <Button variant="ghost">Products</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
