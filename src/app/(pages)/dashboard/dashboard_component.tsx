"use client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import debounce from "lodash/debounce";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Printer, DollarSign, Loader2, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReceivePaymentModal } from "@/components/ReceivePaymentModal";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/helpers";

interface SearchResult {
  type: "customer" | "product" | "invoice";
  id: number;
  name: string;
}

interface CustomerInvoice {
  id: number;
  customerName: string;
  contactNumber: string;
  totalAmount: string;
  paymentReceived: string;
  remainingAmount: string;
  dueDate: string;
  status: 'Paid' | 'Overdue' | 'Pending';
}

export default function DashboardComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [customerInvoices, setCustomerInvoices] = useState<CustomerInvoice[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);

  const handleSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case "customer":
        router.push(`/customers/edit/${result.id}`);
        break;
      case "product":
        router.push(`/products/edit/${result.id}`);
        break;
      case "invoice":
        router.push(`/invoices/${result.id}`);
        break;
    }
  };

  const fetchCustomerInvoices = async () => {
    try {
      const response = await fetch("/api/customer-invoices");
      if (!response.ok) throw new Error("Failed to fetch customer invoices");
      const data: CustomerInvoice[] = await response.json();
      setCustomerInvoices(data);
    } catch (error) {
      console.error("Error fetching customer invoices:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customer invoices. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCustomerInvoices();
  }, []);

  const handleReceivePayment = (invoice: CustomerInvoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (amount: number) => {
    if (!selectedInvoice) return;

    try {
      const response = await fetch(`/api/invoices/${selectedInvoice.id}/receive-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error("Failed to process payment");

      setIsPaymentModalOpen(false);
      fetchCustomerInvoices(); // Now this function is defined
      toast({
        title: "Success",
        description: "Payment received successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handlePrintInvoice = (invoiceId: number) => {
    router.push(`/invoices/${invoiceId}`);
  };  


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-6">
        <div className="flex space-x-2 items-center">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search customers, products, or invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Search Results</h2>
            <ul className="space-y-2">
              {searchResults.map((result) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                  onClick={() => handleResultClick(result)}
                >
                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)}: {result.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Customer Invoices</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S#</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerInvoices.map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.contactNumber}</TableCell>
                <TableCell>${parseFloat(invoice.totalAmount).toFixed(2)}</TableCell>
                <TableCell>${parseFloat(invoice.remainingAmount).toFixed(2)}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {invoice.status !== 'Paid' && (
                        <DropdownMenuItem onClick={() => handleReceivePayment(invoice)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Receive Payment</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Link href={`/invoices/edit/${invoice.id}`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintInvoice(invoice.id)}>
                          <Printer className="mr-2 h-4 w-4" />
                          <span>Print</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedInvoice && (
        <ReceivePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handlePaymentSubmit}
          invoiceId={selectedInvoice.id}
          customerName={selectedInvoice.customerName}
          totalAmount={parseFloat(selectedInvoice.totalAmount.toString())}
          amountDue={parseFloat(selectedInvoice.remainingAmount.toString())}
        />
      )}
    </div>
  );
}
