"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Plus, MoreVertical, Printer, Edit, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/helpers";

interface Invoice {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();
  const router = useRouter();

  const fetchInvoices = useCallback(
    async (
      searchTerm: string,
      page: number,
      itemsPerPage: number,
      sortField: string | null,
      sortOrder: "asc" | "desc"
    ) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/invoices?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}${
            sortField ? `&sortField=${sortField}&sortOrder=${sortOrder}` : ""
          }`
        );
        if (!response.ok) throw new Error("Failed to fetch invoices");
        const data = await response.json();
        setInvoices(data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast({
          title: "Error",
          description: "Failed to fetch invoices. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchInvoices("", 1, itemsPerPage, null, "asc");
  }, [fetchInvoices, itemsPerPage]);

  const handleSearch = (searchTerm: string) => {
    fetchInvoices(searchTerm, 1, itemsPerPage, null, "asc");
  };

  const handlePageChange = (page: number) => {
    setIsPaginating(true);
    setCurrentPage(page);
    fetchInvoices("", page, itemsPerPage, null, "asc").finally(() => setIsPaginating(false));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    fetchInvoices("", 1, value, null, "asc");
  };

  const handleViewInvoice = (id: number) => {
    router.push(`/invoices/${id}`);
  };

  const handleEditInvoice = (id: number) => {
    router.push(`/invoices/edit/${id}`);
  };

  const handleDeleteInvoice = async (id: number) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete invoice");
        toast({ title: "Success", description: "Invoice deleted successfully" });
        fetchInvoices("", 1, itemsPerPage, null, "asc"); // Refresh the list
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast({
          title: "Error",
          description: "Failed to delete invoice. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex-none p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Invoice Management</h1>
        <Search link="/invoices/create" onSearch={handleSearch} />
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full mt-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex justify-center items-center h-full mt-10">
              <p className="text-gray-500 text-lg">No invoices available yet.</p>
            </div>
          ) : (
            <div className="container mx-auto p-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>${parseFloat(invoice.totalAmount.toString()).toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id)}>
                                <Printer className="mr-2 h-4 w-4" />
                                <span>View & Print</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditInvoice(invoice.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isLoading && invoices.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isPaginating={isPaginating}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </>
  );
}
