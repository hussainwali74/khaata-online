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

  const calculateGrossTotal = () => {
    if (!invoice) return 0;
    return invoice.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateNetTotal = () => {
    const grossTotal = calculateGrossTotal();
    return grossTotal - discountAmount;
  };

  const calculateRemainingAmount = () => {
    const total = calculateNetTotal();
    return total - paymentReceived;
  };

  const handleDiscountAmountChange = (value: number) => {
    setDiscountAmount(value);
    setDiscountPercentage((value / calculateGrossTotal()) * 100);
  };

  const handleDiscountPercentageChange = (value: number) => {
    setDiscountPercentage(value);
    setDiscountAmount((value / 100) * calculateGrossTotal());
  };

  const handlePaymentReceivedChange = (value: number) => {
    setPaymentReceived(value);
  };

  const handleFullPayment = () => {
    const totalAmount = calculateNetTotal();
    setPaymentReceived(totalAmount);
  };

  const updateItem = (index: number, field: keyof InvoiceItemInterface, value: any) => {
    if (!invoice) return;
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      lineTotal: field === 'quantity' || field === 'price' 
        ? updatedItems[index].quantity * updatedItems[index].price
        : updatedItems[index].lineTotal
    };
    setInvoice(prevInvoice =>{
      if (!prevInvoice) return null;

      const updateItems = [...prevInvoice.items];
      updateItems[index] = {
        ...updateItems[index],
        [field]: value}
      if (field === 'quantity' || field === 'price') {
        updateItems[index].lineTotal = updateItems[index].quantity * updateItems[index].price;
      }
      return { ...prevInvoice, items: updateItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!invoice) throw new Error("No invoice data");

      const status = calculateInvoiceStatus(
        calculateNetTotal(),
        paymentReceived,
        new Date(dueDate)
      );

      const updatedInvoice = {
        ...invoice,
        customerId: parseInt(selectedCustomerId),
        totalAmount: calculateNetTotal().toString(),
        paymentReceived: paymentReceived.toString(),
        remainingAmount: calculateRemainingAmount().toString(),
        discountAmount: discountAmount.toString(),
        discountPercentage: discountPercentage.toString(),
        dueDate,
        status,
      };

      const response = await fetch(`/api/invoices/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInvoice),
      });

      if (!response.ok) {
        throw new Error("Failed to update invoice");
      }

      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      router.push("/invoices");
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      });
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
          setPaymentReceived={handlePaymentReceivedChange}
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
