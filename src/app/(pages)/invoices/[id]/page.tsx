"use client";

import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import InvoiceComponent from "@/components/InvoiceComponent";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Printer } from "lucide-react";
import { InvoiceInterface } from "@/lib/interfaces";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
	
  const [invoice, setInvoice] = useState<InvoiceInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const componentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch invoice");
        const data = await response.json();
        console.log("---------------------------------------------------");
        console.log("data invoice print comp", data);
        console.log("---------------------------------------------------");
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        // Handle error (e.g., show error message, redirect)
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div className="flex justify-center items-center h-screen">Invoice not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <PdfStyles />

      <div ref={componentRef}>
        <InvoiceComponent {...invoice} />
      </div>
      <div className="mt-8 flex justify-between">
        <Button onClick={() => router.push("/invoices")}>Back to Invoices</Button>
        <Button onClick={() => router.push(`/invoices/edit/${params.id}`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Invoice
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print PDF
        </Button>
      </div>
      <div className="mt-4">
        <p>Payment Received: ${invoice.paymentReceived ? parseFloat(invoice.paymentReceived.toString()).toFixed(2) : '0.00'}</p>
        <p>Remaining Amount: ${invoice.remainingAmount ? parseFloat(invoice.remainingAmount.toString()).toFixed(2) : '0.00'}</p>
        <p>Status: {invoice.status}</p>
      </div>
    </div>
  );
}

const PdfStyles = () => (
  <style>
    {`
		@media print {
		body {
			-webkit-print-color-adjust: exact;
		}
		.print-margins {
			margin: 20px;
		}
		.no-print {
			display: none;
		}
		.shopkeeper-info {
			text-align: center;
			display: block;
		}
		@page {
			margin-top:10mm;
		}
		}
		.shopkeeper-info {
		display: none;
		}
	`}
  </style>
);
