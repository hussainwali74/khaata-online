'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft } from 'lucide-react';

interface CustomerFormData {
  name: string;
  cnic: string;
  phoneNumber: string;
  address: string;
}

export default function CustomerForm({ params }: { params: { action: string; id: string } }) {
  const [customer, setCustomer] = useState<CustomerFormData>({
    name: '',
    cnic: '',
    phoneNumber: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (params.action === 'edit') {
      fetchCustomer();
    }
  }, [params.action, params.id]);

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/customers/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = params.action === 'edit' ? `/api/customers/${params.id}` : '/api/customers';
      const method = params.action === 'edit' ? 'PUT' : 'POST';
      
      // Log the data being sent
      console.log('Sending data:', customer);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to ${params.action} customer: ${errorData.message || response.statusText}`);
      }
      
      toast({
        title: "Success",
        description: `Customer ${params.action === 'edit' ? 'updated' : 'created'} successfully.`,
      });
      router.push('/customers');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${params.action} customer. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{params.action === 'edit' ? 'Edit' : 'Add'} Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="CNIC"
          value={customer.cnic}
          onChange={(e) => setCustomer({ ...customer, cnic: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Phone Number"
          value={customer.phoneNumber}
          onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Address"
          value={customer.address}
          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/customers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Customer'}
          </Button>
        </div>
      </form>
    </>
  );
}