import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export default function LandingPage() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">Welcome to Khata App</h1>
          <p className="text-xl text-gray-600">Simplify your business accounting with ease</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">Manage Your Accounts Effortlessly</h2>
            <ul className="space-y-4">
              {["Easy invoice creation", "Customer management", "Product inventory", "Financial reports"].map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 space-x-4">
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300">
                  Get Started
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="px-6 py-3 rounded-lg font-semibold transition duration-300">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="/landing-image.svg" alt="Khata App" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}