import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  paymentReceived: number;
  setPaymentReceived: (amount: number) => void;
  calculateRemainingAmount: () => number;
  handleFullPayment: () => void;
}

export default function PaymentSection({ 
  paymentReceived, 
  setPaymentReceived, 
  calculateRemainingAmount,
  handleFullPayment
}: PaymentSectionProps) {
  return (
    <>
      <div className="mb-4 shadow-md p-4">
        <Label htmlFor="paymentReceived" className="block text-sm font-medium text-gray-700">
          Payment Received
        </Label>
        <Input
          id="paymentReceived"
          type="number"
          value={paymentReceived}
          onChange={(e) => setPaymentReceived(Number(e.target.value))}
          className="mt-1"
        />
        <div className="my-4">
          <p>Remaining Amount: {calculateRemainingAmount().toFixed(2)}</p>
        </div>
        <Button onClick={handleFullPayment} className="mt-2" type="button">
          Set Full Payment
        </Button>
      </div>
    </>
  );
}