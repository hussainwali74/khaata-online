import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CustomerInterface } from "@/lib/interfaces";

interface CustomerSectionProps {
  customers: CustomerInterface[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
}

export default function CustomerSection({ customers, selectedCustomerId, setSelectedCustomerId }: CustomerSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="customer">Customer</Label>
        <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}