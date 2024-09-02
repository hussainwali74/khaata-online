"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { debounce } from "lodash";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

type SortField = "name" | "price" | "quantity";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const fetchProducts = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}${
            sortField ? `&sortField=${sortField}&sortOrder=${sortOrder}` : ""
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage, toast, sortField, sortOrder]
  );

  const debouncedFetch = useCallback(
    debounce((searchTerm: string) => fetchProducts(searchTerm), 300),
    [fetchProducts]
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  useEffect(() => {
    fetchProducts(search);
  }, [currentPage, itemsPerPage, fetchProducts, sortField, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = async (page: number) => {
    setIsPaginating(true);
    setCurrentPage(page);
    await fetchProducts(search);
    setIsPaginating(false);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Product Management</h1>
        <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="flex-grow"
          />
          <Link href="/products/create" passHref>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
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
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>
                        Price
                        <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort("price")}>
                          {sortField === "price" && sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        Quantity
                        <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort("quantity")}>
                          {sortField === "quantity" && sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>${parseFloat(product.price.toString()).toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link href={`/products/edit/${product.id}`} passHref>
                              <Button variant="outline" className="w-full sm:w-auto">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              variant="destructive"
                              className="w-full sm:w-auto"
                            >
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
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
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
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={currentPage === index + 1}>
                      {index + 1}
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
