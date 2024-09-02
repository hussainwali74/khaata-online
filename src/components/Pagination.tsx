import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Pagination as PaginationContainer,
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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isPaginating: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  isPaginating,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
        </SelectContent>
      </Select>
      <PaginationContainer>
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => onPageChange(currentPage - 1)}
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
              disabled={currentPage === totalPages || isPaginating}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </PaginationContainer>
      {isPaginating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}