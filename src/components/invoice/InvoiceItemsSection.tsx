import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceInterface, InvoiceItemInterface } from "@/lib/interfaces";
import { productsSchema } from "@/db/schema";

interface InvoiceItemsSectionProps {
    invoice: InvoiceInterface;
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceInterface | null>>;
    products: typeof productsSchema.$inferSelect[];
    updateItem: (index: number, field: keyof InvoiceItemInterface, value: number | string) => void;
    addItem: () => void;
    removeItem: (index: number) => void;
}

export default function InvoiceItemsSection({ invoice, setInvoice, products, updateItem, addItem, removeItem }: InvoiceItemsSectionProps) {
    return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Select
                onValueChange={(value) => updateItem(index, "productId", parseInt(value))}
                value={item.productId.toString()}
              >
                <SelectTrigger className="w-3/4">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - ${parseFloat(product.price.toString()).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                className="w-20"
                placeholder="Qty"
              />
              <Input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                className="w-24"
                placeholder="Price"
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}