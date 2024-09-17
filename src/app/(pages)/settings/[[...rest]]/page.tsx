"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ShopSettings {
  id?: number;
  name: string;
  address: string;
  contactNumber: string;
  description: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [shopSettings, setShopSettings] = useState<ShopSettings>({
    name: "",
    address: "",
    contactNumber: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchShopSettings();
  }, []);

  const fetchShopSettings = async () => {
    try {
      const response = await fetch("/api/shop-settings");
      if (response.ok) {
        const data = await response.json();
        setShopSettings(data);
      } else {
        throw new Error("Failed to fetch shop settings");
      }
    } catch (error) {
      console.error("Error fetching shop settings:", error);
      toast({
        title: "Error",
        description: "Failed to load shop settings.",
        variant: "destructive",
      });
    }
  };

  const handleShopSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleShopSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/shop-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopSettings),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Shop settings updated successfully.",
        });
      } else {
        throw new Error("Failed to update shop settings");
      }
    } catch (error) {
      console.error("Error updating shop settings:", error);
      toast({
        title: "Error",
        description: "Failed to update shop settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="w-full bg-slate-300">
          <TabsTrigger className="w-full" value="profile">Profile</TabsTrigger>
          <TabsTrigger className="w-full" value="shop">Shop Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UserProfile  appearance={{
            elements: {
              cardBox: "w-full",
              width: "w-full",
              background: "bg-orage-400",
            },
          }}/>
        </TabsContent>
        <TabsContent value="shop">
          <form onSubmit={handleShopSettingsSubmit} className="space-y-4">
            <Input name="name" value={shopSettings.name} onChange={handleShopSettingsChange} placeholder="Shop Name" />
            <Input
              name="address"
              value={shopSettings.address}
              onChange={handleShopSettingsChange}
              placeholder="Shop Address"
            />
            <Input
              name="contactNumber"
              value={shopSettings.contactNumber}
              onChange={handleShopSettingsChange}
              placeholder="Contact Number"
            />
            <Textarea
              name="description"
              value={shopSettings.description}
              onChange={handleShopSettingsChange}
              placeholder="Shop Description"
            />
            <Button type="submit">Save Shop Settings</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
