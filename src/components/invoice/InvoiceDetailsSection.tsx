import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceDetailsSectionProps {
    dueDate: string;
    setDueDate: (date: string) => void;
    discountPercentage: number;
    setDiscountPercentage: (percentage: number) => void;
    discountAmount: number;
    setDiscountAmount: (amount: number) => void;
    calculateGrossTotal: () => number;
    calculateNetTotal: () => number;
    handleDiscountAmountChange: (amount: number) => void;
    handleDiscountPercentageChange: (percentage: number) => void;
}

export default function InvoiceDetailsSection({
    dueDate,
    setDueDate,
    discountPercentage,
    setDiscountPercentage,
    discountAmount,
    setDiscountAmount,
    calculateGrossTotal,
    calculateNetTotal,
    handleDiscountAmountChange,
    handleDiscountPercentageChange
}: InvoiceDetailsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="discountPercentage">Discount Percentage</Label>
                        <Input
                            type="number"
                            id="discountPercentage"
                            value={discountPercentage.toFixed(2)}
                            onChange={(e) => handleDiscountPercentageChange(Number(e.target.value))}
                            min="0"
                            step="0.01"
                            max="100"
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="discountAmount">Discount Amount</Label>
                        <Input
                            type="number"
                            id="discountAmount"
                            value={discountAmount.toFixed(2)}
                            onChange={(e) => handleDiscountAmountChange(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Gross Total:</Label>
                        <span className="font-semibold">${calculateGrossTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <Label>Discount Amount:</Label>
                        <span className="font-semibold">${discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <Label>Net Total:</Label>
                        <span className="text-xl font-bold">${calculateNetTotal().toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}