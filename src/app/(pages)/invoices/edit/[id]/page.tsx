"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Plus, Minus, Loader2, Eye, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getShopIdForCurrentUser } from "@/app/actions/shopActions";
import { InvoiceItemInterface } from "@/lib/interfaces";
import { productsSchema } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<{
    id: number;
    customerId: number;
    totalAmount: string;
    status: string;
    discount_amount: number;
    discount_percentage: number;
    items: InvoiceItemInterface[];
    dueDate: string;
  } | null>(null);
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<(typeof productsSchema.$inferSelect)[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [shopId, setShopId] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    fetchInvoice();
    fetchCustomers();
    fetchProducts();
    fetchShopId();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch invoice");
      const data = await response.json();
      console.log("---------------------------------------------------");
      console.log("data", data);
      console.log("---------------------------------------------------");

      setInvoice(data);
      setSelectedCustomerId(data.customerId.toString());
      setDiscountAmount(data.discount_amount || 0);
      setDiscountPercentage(data.discount_percentage || 0);
      setDueDate(data.dueDate || "");
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast({ title: "Error", description: "Failed to fetch invoice", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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

  const calculateSubtotal = () => {
    return invoice?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  };

  const handleDiscountAmountChange = (amount: number) => {
    const subtotal = calculateSubtotal();
    setDiscountAmount(amount);
    setDiscountPercentage(subtotal > 0 ? (amount / subtotal) * 100 : 0);
  };

  const handleDiscountPercentageChange = (percentage: number) => {
    const subtotal = calculateSubtotal();
    setDiscountPercentage(percentage);
    setDiscountAmount((percentage / 100) * subtotal);
  };

  const updateItem = (index: number, field: keyof InvoiceItemInterface, value: number | string) => {
    if (!invoice) return;
    const newItems = [...invoice.items];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      newItems[index] = {
        ...newItems[index],
        [field]: parseInt(value.toString()),
        productName: product?.name || "",
        price: product ? parseFloat(product.price.toString()) : 0,
        productDescription: product?.description || "",
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }

    newItems[index].lineTotal = newItems[index].quantity * newItems[index].price;

    setInvoice({ ...invoice, items: newItems });

    // Recalculate discounts
    const newSubtotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setDiscountAmount((discountPercentage / 100) * newSubtotal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !invoice) {
      toast({ title: "Error", description: "Missing shop ID or invoice data", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const body = JSON.stringify({
        customerId: parseInt(selectedCustomerId),
        shopId: shopId,
        status: invoice.status,
        discount_amount: discountAmount,
        discount_percentage: discountPercentage,
        dueDate: dueDate,
        items: invoice.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      console.log("---------------------------------------------------");
      console.log("body", body);
      console.log("---------------------------------------------------");
      const response = await fetch(`/api/invoices/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      if (!response.ok) throw new Error("Failed to update invoice");
      toast({ title: "Success", description: "Invoice updated successfully" });
      // router.push(`/invoices/${params.id}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update invoice", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    if (invoice) {
      setInvoice({
        ...invoice,
        items: [
          ...invoice.items,
          {
            id: Date.now(),
            productId: 0,
            quantity: 1,
            price: 0,
            productName: "",
            productDescription: "",
            lineTotal: 0,
          },
        ],
      });
    }
  };

  const removeItem = (index: number) => {
    if (invoice) {
      const newItems = invoice.items.filter((_, i) => i !== index);
      setInvoice({ ...invoice, items: newItems });
    }
  };

  const calculateGrossTotal = () => {
    return invoice?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  };

  const calculateNetTotal = () => {
    const grossTotal = calculateGrossTotal();
    return grossTotal - discountAmount;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="customer">Customer</Label>
            <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) => updateItem(index, "productId", parseInt(value))}
                    value={item.productId.toString()}
                  >
                    <SelectTrigger className="w-3/4">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - ${parseFloat(product.price.toString()).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                    className="w-20"
                    placeholder="Qty"
                  />
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                    className="w-24"
                    placeholder="Price"
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addItem} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="discountPercentage">Discount Percentage</Label>
                <Input
                  type="number"
                  id="discountPercentage"
                  value={discountPercentage.toFixed(2)}
                  onChange={(e) => handleDiscountPercentageChange(Number(e.target.value))}
                  min="0"
                  step={"1.0"}
                  max="100"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="discountAmount">Discount Amount</Label>
                <Input
                  type="number"
                  id="discountAmount"
                  value={discountAmount.toFixed(2)}
                  onChange={(e) => handleDiscountAmountChange(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Gross Total:</Label>
                <span className="font-semibold">${calculateGrossTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <Label>Discount Amount:</Label>
                <span className="font-semibold">${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <Label>Net Total:</Label>
                <span className="text-xl font-bold">${calculateNetTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/invoices/${params.id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Updating..." : "Update Invoice"}
          </Button>
          <Button type="button" onClick={() => router.push(`/invoices/${params.id}`)}>
            <Eye className="w-4 h-4 mr-2" />
            View and Print
          </Button>
        </div>
      </form>
    </div>
  );
}
