import { InvoiceInterface, InvoiceItemInterface } from "@/lib/interfaces";
import React, { useState, useEffect } from "react";


export default function InvoiceComponent({
  invoiceId,
  items,
  customerName,
  customerAddress,
  invoiceDate,
  dueDate,
  shopName,
  shopAddress,
  discount_amount,
  discount_percentage,
  totalAmount
}: InvoiceInterface) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountedTotal = subtotal - (discount_amount || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{shopName}</h2>
          <p>{shopAddress}</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">INVOICE {invoiceId ? `# ${invoiceId}1232` : ""}</h1>
          <p>Date: {invoiceDate}</p>
          <p>Due Date: {dueDate}</p>
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
              <td className="text-center py-2">Rs. {item.price.toFixed(2)}</td>
              <td className="text-center py-2">Rs. {(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between mb-2 border-b-2 pb-2">
            <span>Subtotal:</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 border-b-2 pb-2">
            <span>Discount %:</span>
            <span> {discount_percentage ? discount_percentage.toFixed(1) : 0}%</span>
          </div>
            <div className="flex justify-between mb-2 border-b-2 pb-2">
            <span>Discount:</span>
            <span>Rs. {discount_amount ? discount_amount.toFixed(2) : 0}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold">
            <span>Total:</span>
            <span>Rs. {discountedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
