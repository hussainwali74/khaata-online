'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { UserPlus, Edit, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { debounce } from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Customer {
  id: number;
  name: string;
  cnic: string;
  phoneNumber: string;
  address: string;
}

type SortField = 'name' | 'cnic' | 'phoneNumber' | 'address';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const fetchCustomers = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    try {
      console.log(`/api/customers?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}${sortField ? `&sortField=${sortField}&sortOrder=${sortOrder}` : ''}`);
      const response = await fetch(`/api/customers?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}${sortField ? `&sortField=${sortField}&sortOrder=${sortOrder}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, sortField, sortOrder, toast]);

  const debouncedFetch = useMemo(
    () => debounce((searchTerm: string) => fetchCustomers(searchTerm), 300),
    [fetchCustomers]
  );

  useEffect(() => {
    debouncedFetch(search);
    return () => debouncedFetch.cancel();
  }, [search, debouncedFetch]);

  useEffect(() => {
    fetchCustomers(search);
  }, [currentPage, itemsPerPage, sortField, sortOrder, fetchCustomers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = async (page: number) => {
    setIsPaginating(true);
    setCurrentPage(page);
    await fetchCustomers(search);
    setIsPaginating(false);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortField(field);
    setCurrentPage(1);
  };

  const handleDeleteCustomer = async (id: number) => {
    try {
      const response = await fetch(`/api/customers?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete customer');
      setCustomers(customers.filter(c => c.id !== id));
      toast({ title: "Success", description: "Customer deleted successfully." });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderSortIcon = (field: SortField) => 
    sortField === field && (sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />);

  const renderTableHeader = (field: SortField, label: string) => (
    <TableHead>
      <Button variant="ghost" size="sm" onClick={() => handleSort(field)} className="font-semibold">
        {label}
        {renderSortIcon(field)}
      </Button>
    </TableHead>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Customer Management</h1>
        <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={handleSearch}
            className="flex-grow"
          />
          <Link href="/customers/create" passHref>
            <Button className="w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Customer
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="container mx-auto p-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {renderTableHeader('name', 'Name')}
                      {renderTableHeader('cnic', 'CNIC')}
                      {renderTableHeader('phoneNumber', 'Phone Number')}
                      {renderTableHeader('address', 'Address')}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.cnic}</TableCell>
                        <TableCell>{customer.phoneNumber}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link href={`/customers/edit/${customer.id}`} passHref>
                              <Button variant="outline" className="w-full sm:w-auto">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button onClick={() => handleDeleteCustomer(customer.id)} variant="destructive" className="w-full sm:w-auto">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
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
      <div className="flex-none bg-white shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((value) => (
                  <SelectItem key={value} value={value.toString()}>{value} per page</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isPaginating}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isPaginating}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      {isPaginating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}