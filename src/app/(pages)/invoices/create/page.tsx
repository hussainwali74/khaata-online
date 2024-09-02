"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getShopIdForCurrentUser } from "@/app/actions/shopActions";

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
}

interface InvoiceItem {
  productId: number;
  quantity: number;
}

export default function CreateInvoicePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([{ productId: 0, quantity: 1 }]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [shopId, setShopId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchShopId();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
    }
  };

  const fetchShopId = async () => {
    try {
      const id = await getShopIdForCurrentUser();
      setShopId(id);
    } catch (error) {
      console.error("Failed to fetch shop ID:", error);
      toast({
        title: "Error",
        description: "Failed to fetch shop ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      toast({ title: "Error", description: "Shop ID not available", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: parseInt(selectedCustomerId),
          shopId: shopId,
          items: items
            .filter((item) => item.productId !== 0)
            .map((item) => ({
              ...item,
              productId: parseInt(item.productId.toString()),
            })),
        }),
      });
      if (!response.ok) throw new Error("Failed to create invoice");
      toast({ title: "Success", description: "Invoice created successfully" });
      router.push("/invoices");
    } catch (error) {
      toast({ title: "Error", description: "Failed to create invoice", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
            Customer
          </label>
          <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="-">No customers found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Invoice Items</h2>
          {items?.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Select
                onValueChange={(value) => updateItem(index, "productId", parseInt(value))}
                value={item.productId.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.length > 0 ? (
                    products?.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - ${parseFloat(product.price).toFixed(2)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="-">No products found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                className="w-20"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index)}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addItem} variant="outline" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/invoices")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
