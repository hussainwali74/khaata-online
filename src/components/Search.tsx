import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  link: string;
}

export default function Search({ onSearch, link }: SearchProps) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => onSearch(searchTerm), 300),
    [onSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
      <Input type="text" placeholder="Search..." value={search} onChange={handleSearch} className="flex-grow" />
      <Link href={link} passHref>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </Link>
    </div>
  );
}
