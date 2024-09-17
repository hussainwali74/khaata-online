"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Eye } from "lucide-react";
import { getShopIdForCurrentUser } from "@/app/actions/shopActions";
import { InvoiceInterface, InvoiceItemInterface } from "@/lib/interfaces";
import { productsSchema } from "@/db/schema";
import CustomerSection from "@/components/invoice/CustomerSection";
import InvoiceItemsSection from "@/components/invoice/InvoiceItemsSection";
import InvoiceDetailsSection from "@/components/invoice/InvoiceDetailsSection";
import PaymentSection from "@/components/invoice/PaymentSection";
import { calculateInvoiceStatus } from '@/lib/invoiceHelpers';

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<InvoiceInterface | null>(null);
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);
  const [products, setProducts] = useState<(typeof productsSchema.$inferSelect)[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopId, setShopId] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentReceived, setPaymentReceived] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

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
      console.log("data of invoice fetched", data);
      console.log("---------------------------------------------------");
      setInvoice({
        ...data,
        totalAmount: parseFloat(data.totalAmount),
        discountAmount: parseFloat(data.discountAmount),
        discountPercentage: parseFloat(data.discountPercentage),
        paymentReceived: parseFloat(data.paymentReceived),
        remainingAmount: parseFloat(data.remainingAmount),
      });
      setSelectedCustomerId(data.customerId.toString());
      setDiscountAmount(parseFloat(data.discountAmount) || 0);
      setDiscountPercentage(parseFloat(data.discountPercentage) || 0);
      setDueDate(data.dueDate || new Date().toISOString().split('T')[0]);
      setPaymentReceived(parseFloat(data.paymentReceived) || 0);
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
    return invoice?.items.reduce((acc: number, item: InvoiceItemInterface) => acc + item.price * item.quantity, 0) || 0;
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
      const product = products.find((p) => p.id === Number(value));
      newItems[index] = {
        ...newItems[index],
        [field]: Number(value),
        productName: product?.name || "",
        price: product ? parseFloat(product.price.toString()) : 0,
        productDescription: product?.description || "",
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: Number(value) };
    }

    newItems[index].lineTotal = newItems[index].quantity * newItems[index].price;

    setInvoice({ ...invoice, items: newItems });

    // Recalculate discounts
    const newSubtotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setDiscountAmount((discountPercentage / 100) * newSubtotal);
  };

  const calculateGrossTotal = () => {

    return invoice?.items.reduce((acc: number, item: InvoiceItemInterface) => acc + item.price * item.quantity, 0) || 0;
  };

  const calculateNetTotal = () => {
    const grossTotal = calculateGrossTotal();
    return grossTotal - discountAmount;
  };

  const calculateRemainingAmount = () => {
    const total = calculateNetTotal();
    return total - paymentReceived;
  };

  const handlePaymentReceivedChange = (value: number) => {
    setPaymentReceived(value);
  };

  const handleFullPayment = () => {
    const totalAmount = calculateNetTotal();
    setPaymentReceived(totalAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !invoice) {
      toast({ title: "Error", description: "Missing shop ID or invoice data", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const totalAmount = calculateNetTotal();
      const remainingAmount = calculateRemainingAmount();
      const status = calculateInvoiceStatus(totalAmount, paymentReceived);
      const body = JSON.stringify({
        customerId: parseInt(selectedCustomerId),
        shopId: shopId,
        status: status,
        discountAmount: discountAmount,
        discountPercentage: discountPercentage,
        dueDate: dueDate,
        items: invoice.items,
        paymentReceived: paymentReceived,
        remainingAmount: remainingAmount,
        totalAmount: totalAmount,
      });
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
      const newItems = invoice.items.filter((_: InvoiceItemInterface, i: number) => i !== index);
      setInvoice({ ...invoice, items: newItems });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomerSection
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
        />
        <InvoiceItemsSection
          invoice={invoice}
          setInvoice={setInvoice}
          products={products}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
        />
        <InvoiceDetailsSection
          dueDate={dueDate}
          setDueDate={setDueDate}
          discountPercentage={discountPercentage}
          setDiscountPercentage={setDiscountPercentage}
          discountAmount={discountAmount}
          setDiscountAmount={setDiscountAmount}
          calculateGrossTotal={calculateGrossTotal}
          calculateNetTotal={calculateNetTotal}
          handleDiscountAmountChange={handleDiscountAmountChange}
          handleDiscountPercentageChange={handleDiscountPercentageChange}
        />
        <PaymentSection
          paymentReceived={paymentReceived}
          setPaymentReceived={setPaymentReceived}
          calculateRemainingAmount={calculateRemainingAmount}
          handleFullPayment={handleFullPayment}
        />
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
