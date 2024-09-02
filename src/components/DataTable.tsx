import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
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

export interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T, S extends string> {
  data: T[];
  columns: Column<T>[];
  onSort?: (field: S) => void;
  sortField?: S | null;
  sortOrder?: 'asc' | 'desc';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: string) => void;
  isLoading?: boolean;
}

export function DataTable<T, S extends string>({
  data,
  columns,
  onSort,
  sortField,
  sortOrder,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  isLoading,
}: DataTableProps<T, S>) {
  const renderCellContent = (column: Column<T>, row: T): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    } else {
      const value = row[column.accessor as keyof T];
      if (React.isValidElement(value)) {
        return value;
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return String(value);
    }
  };

  return (
    <div className='overflow-x-auto pt-2 '>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead className='justify-center text-start' key={index}>
                {column.header}
                {column.sortable && onSort && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      if (typeof column.accessor === 'string') {
                        onSort(column.accessor as keyof T & S);
                      }
                    }}
                  >
                    {typeof column.accessor === 'string' && sortField === (column.accessor as keyof T & S) && sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {renderCellContent(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
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
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => onPageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
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
  );
}