'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Package, FileText, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import debounce from 'lodash/debounce';

interface SearchResult {
  type: 'customer' | 'product' | 'invoice';
  id: number;
  name: string;
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
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
  }, [toast]);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'customer':
        router.push(`/customers/edit/${result.id}`);
        break;
      case 'product':
        router.push(`/products/edit/${result.id}`);
        break;
      case 'invoice':
        router.push(`/invoices/${result.id}`);
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Customers"
          description="Manage your customer database"
          icon={Users}
          href="/customers"
        />
        <DashboardCard
          title="Products"
          description="Manage your product catalog"
          icon={Package}
          href="/products"
        />
        <DashboardCard
          title="Invoices"
          description="Create and manage invoices"
          icon={FileText}
          href="/invoices"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, icon: Icon, href }: { title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; href: string }) {
  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
        <Icon className="w-8 h-8 text-blue-500 mb-2" />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}