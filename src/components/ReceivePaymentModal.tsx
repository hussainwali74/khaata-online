import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceivePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  invoiceId: number;
  customerName: string;
  totalAmount: number;
  amountDue: number;
}

export function ReceivePaymentModal({
  isOpen,
  onClose,
  onSubmit,
  invoiceId,
  customerName,
  totalAmount,
  amountDue
}: ReceivePaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!isNaN(amount) && amount > 0) {
      onSubmit(amount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive Payment for Invoice #{invoiceId}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Customer
              </Label>
              <Input id="customerName" value={customerName} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalAmount" className="text-right">
                Total Amount
              </Label>
              <Input id="totalAmount" value={`$${totalAmount.toFixed(2)}`} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amountDue" className="text-right">
                Amount Due
              </Label>
              <Input id="amountDue" value={`$${amountDue.toFixed(2)}`} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentAmount" className="text-right">
                Payment Amount
              </Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
                className="col-span-3"
                step="0.01"
                min="0.01"
                max={amountDue}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Receive Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}