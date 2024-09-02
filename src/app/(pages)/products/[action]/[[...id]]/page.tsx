"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getShopIdForCurrentUser } from "@/app/actions/shopActions";
import { productsSchema } from "@/db/schema";

export default function ProductForm({ params }: { params: { action: string; id?: string[] } }) {
  const [product, setProduct] = useState<typeof productsSchema.$inferInsert>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [shopId, setShopId] = useState<number | null>(null);

  const isEditing = params.action === "edit";
  const productId = params.id?.[0];

  useEffect(() => {
    async function fetchShopId() {
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
    }

    fetchShopId();
  }, [toast]);

  useEffect(() => {
    if (isEditing && productId) {
      fetchProduct();
    }
  }, [isEditing, productId]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct({
        ...data,
        price: data.price.toString(),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!shopId) {
        throw new Error("Shop ID not available");
      }

      const body: typeof productsSchema.$inferInsert = {
        name: product?.name || "",
        shopId: shopId,
        description: product?.description || "",
        imageUrl: product?.imageUrl || "",
        quantity: product?.quantity || 0,
        price: product?.price || 0,
      };

      const url = isEditing ? `/api/products/${productId}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} product`);
      }
      toast({
        title: "Success",
        description: `Product ${isEditing ? "updated" : "created"} successfully.`,
      });
      router.push("/products");
    } catch (error) {
      console.error("Error in product form:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? "Edit" : "Add"} Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Product Name"
            value={product?.name ?? ""}
            onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value, shopId: prev?.shopId ?? 0 }))}
            required
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Product Description"
            value={product?.description ?? ""}
            onChange={(e) =>
              setProduct((prev) => {
                if (prev) {
                  return { ...prev, description: e.target.value, shopId: prev.shopId ?? 0 };
                }
                return { name: "", shopId: 0, description: e.target.value };
              })
            }
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={product?.price ?? ""}
            onChange={(e) =>
              setProduct((prev) => {
                if (prev) {
                  return { ...prev, price: parseFloat(e.target.value) || 0, shopId: prev.shopId ?? 0 };
                }
                return { name: "", shopId: 0, price: parseFloat(e.target.value) || 0 };
              })
            }
            required
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="Image URL"
            value={product?.imageUrl ?? ""}
            onChange={(e) =>
              setProduct((prev) => {
                if (prev) {
                  return { ...prev, imageUrl: e.target.value, shopId: prev.shopId ?? 0 };
                }
                return { name: "", shopId: 0, imageUrl: e.target.value };
              })
            }
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push("/products")} className="w-full sm:w-auto" disabled={isSubmitting}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Create"} Product
              </>
            )}
          </Button>
        </div>
      </form>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>{isEditing ? "Updating" : "Creating"} product...</span>
          </div>
        </div>
      )}
    </div>
  );
}
