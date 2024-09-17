"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import axios from "axios";

export default function OnboardingPage() {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopContact, setShopContact] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body = JSON.stringify({
        shopName,
        shopAddress,
        shopContact,
        description,
      });
      const response = await axios.post("/api/shops", body);

      toast({ title: "Success", description: "Shop created successfully" });
      router.push("/dashboard");
    } catch (error: any) {
      console.log("---------------------------------------------------");
      console.log("error in page creating shop", error);
      console.log("---------------------------------------------------");
      if (error.response.data.error) {
        toast({ title: "Error", description: error.response.data.error, variant: "destructive" });
        router.push("/dashboard");
      } else {
        toast({ title: "Error", description: "Failed to create shop", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl  justify-center items-center lg:mt-36 mt-2">
      <h1 className="text-2xl font-bold mb-4">Create Your Shop</h1>
      <form onSubmit={handleSubmit} className="space-y-4 justify-center items-center">
        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
            Shop Name
          </label>
          <Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700">
            Shop Address
          </label>
          <Input id="shopAddress" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="shopContact" className="block text-sm font-medium text-gray-700">
            Shop Contact
          </label>
          <Input id="shopContact" value={shopContact} onChange={(e) => setShopContact(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Creating..." : "Create Shop"}
        </Button>
      </form>
    </div>
  );
}
