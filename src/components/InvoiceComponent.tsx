import { InvoiceInterface, InvoiceItemInterface } from "@/lib/interfaces";
import React from "react";

export default function InvoiceComponent({
  invoiceId,
  items,
  customerName,
  customerAddress,
  invoiceDate,
  dueDate,
  shopName,
  shopAddress,
  discountAmount,
  discountPercentage,
  totalAmount,
  paymentReceived,
  remainingAmount,
  status = 'amount due' // Provide a default value
}: InvoiceInterface) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatCurrency = (value: number | string | null | undefined) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue != null ? numValue.toFixed(2) : '0.00';
  };

  // Calculate discount amount if percentage is provided
  const calculatedDiscountAmount = discountPercentage 
    ? subtotal * (parseFloat(discountPercentage) / 100)
    : parseFloat(discountAmount || '0');

  // Calculate total after discount
  const calculatedTotal = subtotal - calculatedDiscountAmount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{shopName}</h2>
          <p>{shopAddress}</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">INVOICE {invoiceId ? `# ${invoiceId}` : ""}</h1>
          <p>Date: {invoiceDate}</p>
          <p>Due Date: {dueDate}</p>
          <p className="mt-2 font-semibold">
            Status: <span className={status === 'paid' ? 'text-green-600' : 'text-red-600'}>
              {status.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Bill To:</h3>
        <p>{customerName}</p>
        <p>{customerAddress}</p>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b bg-gray-100 ">
            <th className="text-left p-2">Item</th>
            <th className="text-center p-2">Quantity</th>
            <th className="text-center p-2">Price</th>
            <th className="text-center p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.productName}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-center py-2">Rs. {formatCurrency(item.price)}</td>
              <td className="text-center py-2">Rs. {formatCurrency(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between mb-2 border-b-2 pb-2">
            <span>Subtotal:</span>
            <span>Rs. {formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2 border-b-2 pb-2">
            <span>Discount %:</span>
            <span>{formatCurrency(discountPercentage)}%</span>
          </div>
          <div className="flex justify-between mb-2 border-b-2 pb-2">
            <span>Discount Amount:</span>
            <span>Rs. {formatCurrency(calculatedDiscountAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold">
            <span>Total:</span>
            <span>Rs. {formatCurrency(calculatedTotal)}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span>Payment Received:</span>
            <span>Rs. {formatCurrency(paymentReceived)}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold">
            <span>Remaining Amount:</span>
            <span>Rs. {formatCurrency(remainingAmount)}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span>Status:</span>
            <span className={`${status === 'paid' ? 'text-green-600' : 'text-red-600'} font-semibold`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
