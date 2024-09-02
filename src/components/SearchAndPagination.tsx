import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { debounce } from 'lodash';
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

interface SearchAndPaginationProps {
  fetchData: (searchTerm: string, page: number, itemsPerPage: number, sortField: string | null, sortOrder: 'asc' | 'desc') => Promise<{ totalPages: number }>;
  sortFields: string[];
}

export default function SearchAndPagination({ fetchData, sortFields }: SearchAndPaginationProps) {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedFetch = useCallback(
    debounce(async (searchTerm: string) => {
      const result = await fetchData(searchTerm, currentPage, itemsPerPage, sortField, sortOrder);
      setTotalPages(result.totalPages);
    }, 300),
    [fetchData, currentPage, itemsPerPage, sortField, sortOrder]
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  useEffect(() => {
    (async () => {
      const result = await fetchData(search, currentPage, itemsPerPage, sortField, sortOrder);
      setTotalPages(result.totalPages);
    })();
  }, [currentPage, itemsPerPage, fetchData, sortField, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = async (page: number) => {
    setIsPaginating(true);
    setCurrentPage(page);
    const result = await fetchData(search, page, itemsPerPage, sortField, sortOrder);
    setTotalPages(result.totalPages);
    setIsPaginating(false);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="flex-grow"
        />
      </div>
      <div className="overflow-x-auto">
        {sortFields.map((field) => (
          <Button
            key={field}
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => handleSort(field)}
          >
            {sortField === field && sortOrder === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        ))}
      </div>
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
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
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
      {isPaginating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}