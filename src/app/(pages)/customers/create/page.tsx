'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

export default function CreateCustomerPage() {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          cnic,
          phoneNumber,
          address,
        }),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      toast({ title: "Success", description: "Customer created successfully" });
      router.push('/customers');
    } catch (error) {
      toast({ title: "Error", description: "Failed to create customer", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
          <Input
            id="cnic"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/customers')} disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Create Customer
          </Button>
        </div>
      </form>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Creating customer...</span>
          </div>
        </div>
      )}
    </div>
  );
}