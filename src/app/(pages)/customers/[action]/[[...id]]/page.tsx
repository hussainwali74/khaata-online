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

export default function CustomerForm({ params }: { params: { action: string; id?: string[] } }) {
  const [customer, setCustomer] = useState<CustomerFormData>({
    name: '',
    cnic: '',
    phoneNumber: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isEditing = params.action === 'edit';
  const customerId = params.id?.[0];

  useEffect(() => {
    if (isEditing && customerId) {
      fetchCustomer();
    }
  }, [isEditing, customerId]);

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/customers/${customerId}`);
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
      const url = isEditing ? `/api/customers/${customerId}` : '/api/customers';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} customer`);
      }
      toast({
        title: "Success",
        description: `Customer ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      router.push('/customers');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} customer. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            id="name"
            type="text"
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
          <Input
            id="cnic"
            type="text"
            placeholder="CNIC Number"
            value={customer.cnic}
            onChange={(e) => setCustomer({ ...customer, cnic: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            value={customer.phoneNumber}
            onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <Input
            id="address"
            type="text"
            placeholder="Address"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            className="mt-1"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push('/customers')} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
}