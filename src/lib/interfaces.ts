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
  invoiceId?: number;
  items: InvoiceItemInterface[];
  customerName: string;
  customerAddress: string;
  invoiceDate: string;
  dueDate: string;
  shopName: string;
  shopAddress: string;
  discount_amount: number;
  discount_percentage: number;
  totalAmount: number;
}
