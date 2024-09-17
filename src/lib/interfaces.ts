export interface InvoiceItemInterface {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  productDescription: string;
  lineTotal: number;
}

export interface InvoiceInterface {
  id: number;
  customerId: number;
  customerName: string;
  customerAddress: string;
  invoiceId: number;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItemInterface[];
  totalAmount: number | string;
  paymentReceived: number | string;
  remainingAmount: number | string;
  discountAmount: string | null;
  discountPercentage: string | null;
  status: 'paid' | 'amount due';
  shopName: string;
  shopAddress: string;
}

export interface CustomerInterface {
  id: number;
  name: string;
  cnic?: string;
  phoneNumber?: string;
  address?: string;
}